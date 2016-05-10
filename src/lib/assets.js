/* Dependencies */
const fs = require('fs');

/* Own Dependencies */
const glob = require('./glob');

/* A method to copy over all assets */
module.exports = (sourceDir, targetDir) => {
	let assets = glob.from([sourceDir])('**/*.!(md)');

	assets.forEach(asset => {
		let source = asset.absolute;
		let target = glob.to(targetDir)(asset.relative);
		let contents = fs.readFileSync(source);

		fs.writeFileSync(target, contents);
	});
};
