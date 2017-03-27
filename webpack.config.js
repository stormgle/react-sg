
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  
  entry: {
		/* built library */
		lib : './dist/exporter.js',
		/* demo pages */
		page : './demo/lib/page.js',
		navigator : './demo/lib/navigator.js',
	}, 

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'demo', 'web', 'build')
  },

  module: {
		rules : [{
			test: /\.css$/, 
			use: ExtractTextPlugin.extract({
				use : 'css-loader'
			})
		}]
	},
	
	plugins: [
		new ExtractTextPlugin('bundle.css')
	]

}