const WebpackMd5Hash = require("webpack-md5-hash");

module.exports = {
	// ...
	output: {
		filename: "[name].[chunkhash].js",
	},
	plugins: [new WebpackMd5Hash()],
};
