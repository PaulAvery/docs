#!/usr/bin/env node

/* Dependencies */
const app = require('commander');
const path = require('path');

/* Own Stuff */
const pkg = require('../package.json');
const docs = require('./index');

/* Define / parse data */
app.version(pkg.version)
	.option('-i --in [directory]', 'The input directory [$PWD/docs]', path.join(process.cwd(), 'docs'))
	.option('-o --out [directory]', 'The output directory [$PWD/docs/out]', path.join(process.cwd(), 'docs/out'))
	.option('-t --theme [package]', 'The theme to use [@paulavery/docs-theme-cayman]', '@paulavery/docs-theme-cayman')
	.option('-p --package [package.json]', 'The package.json file to use for data [$PWD/package.json]', path.join(process.cwd(), 'package.json'))
	.parse(process.argv);

/* Run documentation generation */
docs({
	data: require(app.package),
	source: app.in,
	target: app.out,
	theme: app.theme
});
