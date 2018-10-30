const main = require('../index');
const fs = require('fs');
const fse = require('fs-extra');
const uglify = require('uglify-es');

let document = '';

exports.createIndex = function() {
    document  = `<html>
        <head>`;

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

    main.scripts = this.compressFiles(main.scripts);

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

exports.compressFiles = function(code) {
    const result = uglify.minify(code);
    return result.code;
}