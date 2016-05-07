/* Dependencies */
const path = require('path');
const glob = require('glob').sync;
const mkdir = require('mkdirp').sync;

/*
 * Function to glob a relative expression across multiple root folders.
 * If the same filename is found in multiple root folders, the first one is picked
 */
exports.from = bases => {
	return expression => {
		let paths = bases.map(base => {
			/* Get all entries with relative and absolute paths for a single base */
			let entries = glob(path.join(base, expression));

			return entries.map(entry => {
				return {
					relative: path.relative(base, entry),
					absolute: entry
				};
			});
		})
		/* Reduce all the bases paths into one array */
		.reduce((sum, entry) => sum.concat(entry))
		/* Filter out duplicates by reducing into object */
		.reduce((sum, entry) => {
			if(!sum[entry.relative]) {
				sum[entry.relative] = entry;
			}

			return sum;
		}, {});

		/* Transform object back to array */
		return Object.keys(paths).map(key => paths[key]);
	};
};

/*
 * Function to prefix a pathname
 * In addition the path will be created
 */
exports.to = base => {
	return target => {
		let pth = path.join(base, target);

		mkdir(path.dirname(pth));

		return pth;
	};
};
