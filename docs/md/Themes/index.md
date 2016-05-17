# Themes
Generating output is done in two steps. Firstly, all markdown files in the input directory are parsed into a tree-like [structure](../Input%20Structure.md).
Then that structure is passed to a theme, which should generate the output files.

The theme itself is responsible for copying its assets, while any non-markdown files in the source folder are copied by the `docs` library.

The only file required to make a theme is the [theme.js](theme.js.md) located in the root of your themes directory.
