/* Dependencies */
const path = require('path');

/* Own Dependencies */
const glob = require('./lib/glob');
const buildTree = require('./lib/tree');
const loadTheme = require('./lib/theme');
const copyAssets = require('./lib/assets');
const makeRenderer = require('./lib/render');

module.exports = options => {
	/* Define all paths */
	const root = options.source;
	const target = options.target;
	const source = path.join(root, 'md');
	const assets = path.join(root, 'assets');
	const themes = [
		path.join(path.dirname(require.resolve(options.theme))),
		path.join(root, 'theme')
	];

	/* Assemble the theme and the render method */
	const theme = loadTheme(themes);
	const render = makeRenderer(theme, root);

	/* Build the tree */
	const tree = buildTree(source, theme, render);

	/* Compile output */
	theme.compile({ pkg: options.data, tree }, glob.from(themes), glob.to(target));

	/* Copy assets */
	copyAssets(assets, target);
};
