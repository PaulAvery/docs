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
			let fileTarget = theme.mapFile(fileMap[file]);
			let linkTarget = path.resolve(path.dirname(file), decodeURI(link));
			let isRelative = path.relative(root, linkTarget).substr(0, 3) !== '../';
			let isMarkdown = isRelative && path.extname(linkTarget) === '.md' && fileMap[linkTarget];
			let isAsset = isRelative && !isMarkdown;

			if(isAsset) {
				return './' + path.relative(fileTarget, path.relative(path.join(root, 'src'), linkTarget)).substr(3);
			} else if(isMarkdown) {
				return './' + path.relative(fileTarget, theme.mapUrl(fileMap[linkTarget])).substr(3);
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
