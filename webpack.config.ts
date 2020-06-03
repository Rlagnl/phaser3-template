import path from 'path'
import webpack from "webpack"
import htmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const config: webpack.Configuration = {
  mode: 'development',
  //entry为入口,webpack从这里开始编译
  entry: [
    "babel-polyfill",
    path.join(__dirname, './src/index.ts')
  ],
  //output为输出 path代表路径 filename代表文件名称
  output: {
    path: path.join(__dirname, './output'),
    filename: 'bundle.[hash:8].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'output'),  //启动路径
    host: 'localhost',  //域名
    port: 8018,  //端口号
    hot: true,
    open: true
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin()
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@': path.join(__dirname, './src'),
    }
  },
  //module是配置所有模块要经过什么处理
  //test:处理什么类型的文件,use:用什么,include:处理这里的,exclude:不处理这里的
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader'],
          publicPath: path.join(__dirname, '/')
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1  //8k一下的转义为base64
          }
        }]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: "index.html",  //打包后的文件名
      template: path.join(__dirname, "./index.html"),  //要打包文件的路径
      inject: true
    }),
    new CleanWebpackPlugin(),
    new ExtractTextPlugin({
      filename: 'index.[hash:8].css'
    })
  ]
}

export default config;
