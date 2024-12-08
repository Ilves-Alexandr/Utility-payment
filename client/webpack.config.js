const path = require('path');

module.exports = {
    entry: './src/index.js', // Точка входа
    output: {
        path: path.resolve(__dirname, 'build'), // Папка для сборки
        filename: 'bundle.js', // Имя результирующего файла
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Файлы .js и .jsx
                exclude: /node_modules/, // Исключить node_modules
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Разрешаем файлы .js и .jsx
    },
};
