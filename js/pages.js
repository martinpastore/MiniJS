const main = require('../index');
var fs = require('fs');
let document = '';

exports.render = function(component) {
    if (main.document  === '') main.document = this.createIndex();
    let html = component.html + component.js + component.css;
    html = this.replaceComponents(html);
    main.document += html;
};

exports.readFile = function(fileName, format) {
    try {
        const data = fs.readFileSync(`./pages/${fileName}/${fileName}.${format}`, 'utf8');
        return data.toString();
    } catch(e) {
        console.log('Error:', e.stack);
    }
};

exports.readPage = function (pages) {
    const result = {
        html: this.readFile(pages[0].html, 'html'),
        js: this.compileJS(pages[1].js),
        css: this.compileCSS(pages[2].css)
    };

    this.render(result);
};

exports.compileCSS = function(css) {
    const script = this.readFile(css, 'css');
    return `<style>${script}</style>`
};

exports.compileJS = function(js) {
    const script = this.readFile(js, 'js');
    return `<script>${script}</script>`
};

exports.replaceComponents = function(html) {
    for (let i in main.components) {
        const openTag = new RegExp(`<${main.components[i].selector}>`, 'g');
        const closeTag = new RegExp(`</${main.components[i].selector}>`, 'g');

        html = html.replace(openTag, main.components[i].html);
        html = html.replace(closeTag, '');
    }

    return html;
};

exports.createIndex = function() {
    document  = `<html>
        <head></head>
        <body id="burgerjs-app">`;
    return document;
};

exports.closeIndex = function() {
    main.document += `</body>
    </html>`;
    this.build();
};

exports.build = function() {
    const dir = './dist';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.writeFile('./dist/index.html', main.document, function (err) {
        if (err) return console.log(err);
    });
};