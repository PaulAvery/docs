# @paulavery/docs - A minimal documentation generator
This module provides very simple rendering of markdown documentation into static webpages.

An example can be found at `https://pages.github.io/PaulAvery/fish-n-chips/`.

The default theme is a modified version of the [Cayman](https://github.com/jasonlong/cayman-theme) theme by Jason Long.

Because this was created for personal use and originally for a very specific project, this is astonishingly non-configurable.

Currently the module checks for a `docs` directory in the current working directory. Within it there should be an `md` directory containing documentation in markdown format. Filenames will become page titles. Files named `index.md` will be used as a directory index.
In addition there may exist a `docs/assets` directory. Everything within this will be copied to the root target directory.

Source Directory and Target directory default to `docs` and `docs_out` but may be overriden via the environment variables `PAULAVERY_DOCS_IN` and `PAULAVERY_DOCS_OUT`.
