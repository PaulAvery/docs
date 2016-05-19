# Structuring your documentation
Input files should be placed in a subfolder of the specified input directory named `src`. You may create subfolders and arbitrarily named markdown files.

Each file or folder is parsed into an entry which may have an arbitrary number of children. This means you wont be able to distinguish files from folders later on.

A file or folders name will be used (without the extension) as this entries title. If a markdown file is named `index.md`, it will be used as the content of its parent directory. So the following structure:

	┌─ index.md
	├─ CLI.md
	└─ Examples
	   ├─ Example 1.md
	   └─ Example 2.md

Will result in the following parsed structure:

```json
{
	name: '',
	content: <Content of index.md>,
	children: [{
		name: 'CLI',
		link: <Dependent on your theme>,
		target: <Dependent on your theme>,
		content: <Parsed content of index.md>,
		children: []
	}, {
		name: 'Examples',
		link: <Dependent on your theme>,
		target: <Dependent on your theme>,
		content: '',
		children: [{
			name: 'Example 1',
			link: <Dependent on your theme>,
			target: <Dependent on your theme>,
			content: <Parsed content of Example 1.md>
			children: []
		}, {
			name: 'Example 1',
			link: <Dependent on your theme>,
			target: <Dependent on your theme>,
			content: <Parsed content of Example 1.md>
			children: []
		}]
	}]
}
```

How this structure is translated into output files entirely depends on your theme.
