const path = require('path');

module.exports = {
    entry: './src/vizjswrapper.js',
    output: {
        filename: 'vizjswrapper.js',
        path: path.resolve(__dirname, 'pages'),
    },
};