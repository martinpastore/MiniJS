const main = require('../index');
const routes = require('./routes');
const services = require('./services');
const fs = require('fs');
const fse = require('fs-extra');
const uglify = require('uglify-es');
const cssmin = require('cssmin');
const minify = require('html-minifier').minify;

let document = '';

exports.createIndex = function() {
    document  = `<html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8"/>
        <title>${main.configs.title}</title>
        <link rel="icon" href="./assets/favicon.ico">`;

    if (main.configs.styles.length > 0) {
        for (let i in main.configs.styles) {
            document += `<link rel="stylesheet" href="${main.configs.styles[i]}">`
        }
    }

    document += `<link rel="stylesheet" href="main.css">
            </head>
    <body id="burgerjs-app">`
    return document;
};

exports.closeIndex = function() {
    if (main.configs.scripts.length > 0) {
        for (let i in main.configs.scripts) {
            main.document += `<script src="${main.configs.scripts[i]}"></script>`
        }
    }

    main.document += `<script src="main.js"></script>
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

    if (fs.existsSync(dir)) {
        fse.removeSync(dir);
    }
    fs.mkdirSync(dir);

    routes.addRoutesManagement();

    main.document = this.compressHTML(main.document);
    main.scripts = this.compressJS(main.scripts);
    main.styles = this.compressCSS(main.styles);

    fs.writeFile('./dist/index.html', main.document, function (err) {
        if (err) return console.log(err);
    });

    fs.writeFile('./dist/main.js', main.scripts, function (err) {
        if (err) return console.log(err);
    });

    fs.writeFile('./dist/main.css', main.styles, function (err) {
        if (err) return console.log(err);
    });

    if (main.configs.scripts.length > 0) {
        for (let i in main.configs.scripts) {
            fs.createReadStream(`./scripts/${main.configs.scripts[i]}`).pipe(fs.createWriteStream(`./dist/${main.configs.scripts[i]}`));
        }
    }

    if (main.configs.styles.length > 0) {
        for (let i in main.configs.styles) {
            fs.createReadStream(`./styles/${main.configs.styles[i]}`).pipe(fs.createWriteStream(`./dist/${main.configs.styles[i]}`));
        }
    }

    fse.copy('./assets/', './dist/assets/');
};

exports.compressJS = function(code) {
    const result = uglify.minify(code);
    return result.code;
}

exports.compressCSS = function(code) {
    const min = cssmin(code);
    return min;
}

exports.compressHTML = function(code) {
    const result = minify(code, {
        collapseWhitespace: true,
        caseSensitive: true
    });
    return result;
}