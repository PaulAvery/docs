/* Dependencies */
const path = require('path');

/* Assembles a theme object from several paths */
module.exports = themePaths => {
	let theme = {};

	/* Require each theme and overwrite the current methods */
	themePaths.forEach(themePath => {
		try {
			let requiredTheme = require(path.join(themePath, 'theme.js'));

			/* Copy all properties to the combined theme */
			Object.keys(requiredTheme).forEach(key => { theme[key] = requiredTheme[key]; });
		} catch(e) {
			/* Only skip if the file was not found */
			if(e.code !== 'MODULE_NOT_FOUND') {
				throw e;
			}
		}
	});

	return theme;
};
