# theme.js
A themes `theme.js` file should export five methods to work properly.
For a full example, check out the [@paulavery/docs-theme-cayman](https://github.com/PaulAvery/docs-theme-cayman) package.

## mapUrl(level)
The `mapUrl()` method is used by the library in conjuction with `mapFile()` to properly resolve links. It is passed a level of the parsed structure (see [Input Structure](../Input%20Structure.md)) and is expected ro return the url under which this entry will be reachable once generation of the documentation is complete.

This allows for both, separate output files per entry, as well as a single page with hash based addressing of entries.

## mapFile(level)
The `mapFile()` method is passed a level of the structure, just like `mapUrl()`. Instead of returning the url to the entry, it should return the filesystem path to the output file.

## assignHighlighters(highlighter)
This method gives the theme the ability to modify the [highlights](https://atom.github.io/highlights/) instance used to highlight code blocks. This allows you to register specific highlighters if your project requires it.

```js
eports.assignHighlighters = highlighter => {
	highlighter.requireGrammarsSync({
		modulePath: require.resolve('atom-language-clojure/package.json')
	});
}
```

## assignMarkdown(markdown)
Similar to the `assignHighlighters` method, the `assignMarkdown` method gives the theme the ability to modify the [markdown-it](https://github.com/markdown-it/markdown-it) instance used to render the markdown files. This allows you to extend rendering with a multitude of plugins.

```js
eports.assignMarkdown = markdown => {
	markdown.use(require('markdown-it-toc-and-anchor').default);
}
```

## compile(root, from, to)
The `compile()` method is the main "meat" of the theme, so to speak. It is passed the root entry as well as configuration options and a couple of utility functions.
