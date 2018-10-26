let document = '';
var fs = require('fs');

exports.render = function(component) {
    if (document === '') document = this.createIndex();
    const html = component.html + component.js + component.css;
    document += html;
};

exports.readComponent = function (component) {
    const result = {
        html: this.readFile(component[0].html, 'html'),
        js: this.compileJS(component[1].js),
        css: this.compileCSS(component[2].css)
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

exports.createIndex = function() {
    document = `<html>
        <head></head>
        <body id="burgerjs-app">`;
    return document;
};

exports.closeIndex = function() {
    document += `</body>
    </html>`;
    this.build();
};

exports.readFile = function(fileName, format) {
    try {
        var data = fs.readFileSync(`./components/${fileName}/${fileName}.${format}`, 'utf8');
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

    fs.writeFile('./dist/index.html', document, function (err) {
        if (err) return console.log(err);
    });
}