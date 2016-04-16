module.exports = function(options) {
	return new Array(options.data.root.depth + 1).join('../');
}
