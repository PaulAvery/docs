/* Dependencies */
const fs = require('fs');
const path = require('path');

/* Parse all markdown files from a source directory into a documentation tree */
module.exports = (source, theme, render) => {
	let contentCreators = [];
	let fileMap = {};

	function renderFile(file, parent) {
		let name = path.basename(file, '.md');

		let child = {
			name: name,
			parent: parent,
			children: []
		};

		child.link = theme.mapUrl(child);
		child.target = theme.mapFile(child);

		contentCreators.push(() => {
			child.content = render(file, child, fileMap);
		});

		fileMap[file] = child;

		return child;
	}

	function renderLevel(src, parent = null) {
		let name = path.basename(src);
		let level = {
			name: parent ? name : null,
			parent: parent,
			children: []
		};

		/* Get all information for directory entries */
		let entries = fs.readdirSync(src)
			.map(entry => path.join(src, entry))
			.map(entry => {
				return {
					name: entry,
					stat: fs.statSync(entry)
				};
			});

		/* Sort into files and folders */
		let files = entries.filter(entry => entry.stat.isFile()).map(entry => entry.name);
		let index = files.filter(file => path.basename(file) === 'index.md');
		let nonindex = files.filter(file => path.basename(file) !== 'index.md' && path.extname(file) === '.md');
		let directories = entries.filter(entry => entry.stat.isDirectory()).map(entry => entry.name);

		/* Process each directory recursively */
		directories
			.map(dir => renderLevel(dir, level))
			.forEach(dir => level.children.push(dir));

		/* Render each file */
		nonindex
			.map(file => renderFile(file, level))
			.forEach(file => level.children.push(file));

		/* Assign link and target file */
		level.link = theme.mapUrl(level);
		level.target = theme.mapFile(level);

		/*
		 * Render index if available.
		 * Has to be last, to ensure everything nested deeper is available to mapUrl()
		 */
		if(index[0]) {
			contentCreators.push(() => {
				level.content = render(index[0], level, fileMap);
			});

			fileMap[index[0]] = level;
		}

		/* Return the compiled level */
		return level;
	}

	/* Assemble the level */
	let level = renderLevel(source);

	/* Run the markdown rendering afterwards to ensure proper path resolution is possible */
	contentCreators.forEach(fn => fn());

	return level;
};
