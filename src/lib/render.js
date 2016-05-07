/* Dependencies */
const fs = require('fs');
const md = require('markdown-it');
const highlights = require('highlights');
const modifyToken = require('markdown-it-modify-token');

/* Own Dependencies */
const rewriteLinks = require('./links');

/* Export a single function that makes us a render function */
module.exports = (theme, root) => {
	/* Assemble the highlighter and renderer */
	const highlighter = highlights();
	const renderer = md({
		html: true,
		breaks: true,
		typographer: true,
		hightlight: (c, l) => highlighter.highlightSync({ fileContents: c, scopeName: '.' + l })
	});

	/* Attach the themes extensions to renderer and highlighter */
	theme.assignHighlighters(highlighter);
	theme.assignMarkdown(renderer);

	/*
	 * Attach the modifytoken middleware after everything else.
	 * This ensures that links from extensions are rewritten as well
	 */
	renderer.use(modifyToken);

	/* Function to render a markdown file */
	return (file, level, fileMap) => {
		/* Set our link rewriter to proper paths */
		renderer.set({ modifyToken: rewriteLinks(file, root, theme, fileMap) });

		/* Render and return */
		return renderer.render(fs.readFileSync(file, 'utf8'));
	};
};
