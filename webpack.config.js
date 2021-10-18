const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, './src/client/index.js'),
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	output: {
		path: path.resolve(__dirname, './public'),
		filename: 'index.js',
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/client/index.html'
		})
	],
	devtool: 'eval-source-map',
};