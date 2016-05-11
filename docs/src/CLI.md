# Usage as a cli tool
The module can be installed globally (or required as a dependency) and exposes the `docs` tool.
To run it with default values simply call:

```bash
docs
```

## Options
### -i --in [directory]
Set the input directory containing your markdown files and assets.
Defaults to `docs`.

### -o --out [directory]
Set the target directory into which the output will be rendered.
Defaults to `docs/out`

### -t --theme [package]
The theme to use. Defaults to [@paulavery/docs-theme-cayman](https://www.npmjs.com/package/@paulavery/docs-theme-cayman).

### -p --package [package.json]
The package.json file to use by the theme.

### -h --help
Print help.

### -V --version
Print version information.
