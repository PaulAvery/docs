/* Dependencies */
const url = require('url');
const path = require('path');

/*
 * Function passed to markdown-it-modify-token
 * It is used to rewrite links and image paths
 */
module.exports = (file, root, theme, fileMap) => {
	let rewrite = link => {
		let parsedUrl = url.parse(link, false, true);

		/* Only handle relative links */
		if(!parsedUrl.host && parsedUrl.pathname[0] !== '/') {
			let linkTarget = path.resolve(path.dirname(file), link);
			let inAssets = path.relative(path.join(root, 'assets'), linkTarget).substr(0, 3) !== '../';
			let inMd = path.relative(path.join(root, 'md'), linkTarget).substr(0, 3) !== '../';

			if(inAssets) {
				return link.substr(3);
			} else if(inMd) {
				let fileTarget = theme.mapFile(fileMap[file]);
				return path.relative(fileTarget, theme.mapUrl(fileMap[linkTarget])).substr(3);
			} else {
				return link;
			}
		} else {
			return link;
		}
	};

	return token => {
		switch (token.type) {
			case 'image':
				token.attrObj.src = rewrite(token.attrObj.src);
				break;
			case 'link_open':
				token.attrObj.href = rewrite(token.attrObj.href);
				break;
		}
	};
};
