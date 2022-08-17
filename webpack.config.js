const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// const NAMESPACES = ['NODE_', 'SRDBMS_'];

// process.env = Object.entries({ ...process.env }).reduce((acc, [key, value]) => {
//   const hasValidNamespace = NAMESPACES.some(ns => key.includes(ns));

//   if (hasValidNamespace) {
//     return {
//       ...acc,
//       [key]: value
//     }
//   } else {
//     return {
//       ...acc
//     }
//   }
// }, {});

const config = {
  entry: {
    app: path.join(__dirname, 'src', 'index.js')
  },
  output: {
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html')
    }),
    // new webpack.DefinePlugin({
    //   'process.env': JSON.stringify(process.env)
    // })
  ],
  devServer: {
    open: true,
    port: 3000
  }
};

module.exports = (env, argv) => {
  if (argv.mode == 'production') {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }

  return config;
};