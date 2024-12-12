const path = require('path');

module.exports = {
    entry: './src/index.js', // Точка входа
    output: {
        filename: 'bundle.js', // Имя результирующего файла
        path: path.resolve(__dirname, 'dist'), // Папка для сборки
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
