const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js', // Точка входа
    output: {
        path: path.resolve(__dirname, 'dist'), // Папка для сборки
        filename: 'bundle.js', // Имя результирующего файла
        publicPath: '/',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Файлы .js и .jsx
                exclude: /node_modules/, // Исключить node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                use: 'file-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Разрешаем файлы .js и .jsx
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin()
    ]

};
