const main = require('../index');
const fs = require('fs');
const fse = require('fs-extra');
let document = '';

exports.createIndex = function() {
    document  = `<html>
        <head>
            <link rel="stylesheet" href="foundation.css">
            <link rel="stylesheet" href="assets/foundation-icons.css">
            <link rel="stylesheet" href="main.css">
        </head>
        <body id="burgerjs-app">`;
    return document;
};

exports.closeIndex = function() {
    main.document += `<script src="jquery.js"></script>
        <script src="what-input.js"></script>
        <script src="foundation.js"></script>
        <script src="main.js"></script>
        </body>
    </html>`;
    this.build();
};

exports.compileCSS = function(css, fileType) {
    const script = this.readFile(fileType, css, 'css');
    return script;
};

exports.compileJS = function(js, fileType) {
    const script = this.readFile(fileType, js, 'js');
    return script;
};


exports.readFile = function(fileType, fileName, format) {
    try {
        const data = fs.readFileSync(`./${fileType}/${fileName}/${fileName}.${format}`, 'utf8');
        return data.toString();
    } catch(e) {
        console.log('Error:', e.stack);
    }
};

exports.build = function() {
    const dir = './dist';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.writeFile('./dist/index.html', main.document, function (err) {
        if (err) return console.log(err);
    });

    fs.writeFile('./dist/main.js', main.scripts, function (err) {
        if (err) return console.log(err);
    });

    fs.writeFile('./dist/main.css', main.styles, function (err) {
        if (err) return console.log(err);
    });

    fs.createReadStream('./styles/foundation.css').pipe(fs.createWriteStream('./dist/foundation.css'));
    fs.createReadStream('./scripts/foundation.js').pipe(fs.createWriteStream('./dist/foundation.js'));
    fs.createReadStream('./scripts/what-input.js').pipe(fs.createWriteStream('./dist/what-input.js'));
    fs.createReadStream('./scripts/jquery.js').pipe(fs.createWriteStream('./dist/jquery.js'));
    fse.copy('./assets/', './dist/assets/');
};