#!/usr/bin/env node
'use strict';

const fs = require('fs');
const hbs = require('handlebars');
const path = require('path');
const slug = require('slug');
const copy = require('recursive-copy');
const highlights = new (require('highlights'))();

const md = require('markdown-it')({
	html: true,
	breaks: true,
	typographer: true,
	highlight: (c, l) => highlights.highlightSync({fileContents: c, scopeName: '.' + l})
});

const index = 'index';

const targetDir = path.resolve(process.cwd(), process.env['PAULAVERY_DOCS_OUT'] || 'docs_out');
const changeFile = path.join(targetDir, 'change');

const docsDir = path.resolve(process.cwd(), process.env['PAULAVERY_DOCS_IN'] || 'docs');
const assetDir = path.join(docsDir, 'assets');
const sourceDir = path.join(docsDir,  'md');

const themeDir = path.join(__dirname, '../theme');
const staticDir = path.join(themeDir, 'static');
const helperDir = path.join(themeDir, 'helpers');
const partialDir = path.join(themeDir, 'templates/partials');
const template = hbs.compile(fs.readFileSync(path.join(themeDir, 'templates/page.hbs'), 'utf8'), {preventIndent: true});

/* Load handlebars partials */
fs.readdirSync(partialDir)
	.map(f => path.join(partialDir, f))
	.map(f => hbs.registerPartial(path.basename(f, '.hbs'), fs.readFileSync(f, 'utf8')), {preventIndent: true});

/* Load handlebars helpers */
fs.readdirSync(helperDir)
	.map(f => path.join(helperDir, f))
	.map(f => hbs.registerHelper(path.basename(f, '.js'), require(f)));

/* Convert filesystem path to slug. Also replace .md extension with .html */
function slugify(pth) {
	let ext = path.extname(pth);
	let dir = path.dirname(pth);
	let base = path.basename(pth, ext);

	return path.join(
		path.normalize(dir)
			.split(path.sep)
			.map(s => slug(s))
			.join(path.sep),
		slug(base) + (ext === '.md' ? '.html' : ext)
	).toLowerCase();
}

/* Parse a directory into a category object */
function parseCategory(dir, parent, pth, toplevel) {
	let category = {parent};
	let entries = fs.readdirSync(dir).map(e => path.join(dir, e));
	let slug = slugify(path.relative(sourceDir, dir));

	/* Set ourselves as toplevel if nothing passed */
	toplevel = category.toplevel = toplevel || category;

	/* Assemble data */
	category.pkg = parent ? parent.pkg : require(path.join(process.cwd(), 'package.json'));
	category.depth = parent ? parent.depth + 1 : 0;
	category.title = parent ? path.basename(dir) : undefined;
	category.source = dir;
	category.path = pth || []
	category.target = path.join(targetDir, slug);

	/* Parse all directories as categories */
	category.categories = entries
		.filter(e => fs.statSync(e).isDirectory())
		.map(d => parseCategory(d, category, category.path.concat(category), toplevel));

	/* Parse all files as pages */
	category.pages = entries
		.filter(e => fs.statSync(e).isFile())
		.map(f => parsePage(f, category, category.path.concat(category), toplevel));

	/* Set link to index or first child */
	category.link = (category.pages.filter(p => p.index)[0] || category.pages[0] || category.categories[0]).link;

	return category;
}

/* Parse a file into a page object */
function parsePage(file, parent, pth, toplevel) {
	let page = {parent, toplevel};
	let slug = slugify(path.relative(sourceDir, file));
	let slugLink = slug === '.' ? '' : slug;

	/* Assemble data */
	page.pkg = parent.pkg;
	page.depth = parent.depth;
	page.source = file;
	page.path = pth;
	page.target = path.join(targetDir, slug);
	page.index = path.basename(slug, '.html') === index
	page.title = page.index ? parent.title : path.basename(file, '.md');
	page.link = page.index ? path.dirname(slugLink) : slugLink;

	/* Load content and parse as markdown */
	page.content = md.render(fs.readFileSync(page.source, 'utf8'));

	return page;
}

/* Render a category object to the out directory */
function renderCategory(category) {
	try {
		fs.mkdirSync(category.target);
	} catch(e) {
		if(e.code !== 'EEXIST') throw e;
	}

	category.pages.forEach(renderPage);
	category.categories.forEach(renderCategory);
}

/* Render a file object to the out directory */
function renderPage(page) {
	fs.writeFileSync(page.target, template(page));
}

/* Render everything */
renderCategory(parseCategory(sourceDir));

/* Copy over static files and assets. Also generate a file containing a timestamp of the last change */
copy(staticDir, targetDir)
	.then(() => copy(assetDir, targetDir))
	.then(() => fs.writeFileSync(changeFile, Date.now().toString()))
	.catch(e => console.error(e));
