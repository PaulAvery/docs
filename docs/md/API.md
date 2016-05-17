# Usage as a library
If required, the module can be used programmatically. It exports a single function which takes an option object.

```js
let docs = require('@paulavery/docs');

docs({
	source: 'docs',
	target: 'docs/out',
	theme: '@paulavery/docs-theme-cayman',
	data: require('./package.json');
});
```

The options object has no default values, so you need to provide everything.

## Options
### source
The source directory containing the markdown files.

### target
The target directory into which the results will be written.

### theme
Path to a theme folder or module. Will be resolved with `required.resolve()`.
For more information on themes see [here](Themes).

### data
The data to be used by the theme. This is theme dependent but the cli uses the packages parsed `package.json` as the default theme works under the assumption that it is passed.
