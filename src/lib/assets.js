/* Dependencies */
const fs = require('fs');
const path = require('path');

/* Own Dependencies */
const glob = require('./glob');

/* A method to copy over all assets */
module.exports = (assetDir, targetRoot) => {
	let assets = glob.from([assetDir])('**/*.*');
	let targetDir = path.join(targetRoot, 'assets');

	assets.forEach(asset => {
		let source = asset.absolute;
		let target = glob.to(targetDir)(asset.relative);
		let contents = fs.readFileSync(source);

		fs.writeFileSync(target, contents);
	});
};
