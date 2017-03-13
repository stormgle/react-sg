
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  
  entry: './demo/lib/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'demo')
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