const main = require('../index');
var fs = require('fs');

exports.render = function(component) {
    const html = component.html + component.js + component.css;
    main.components.push({selector: component.selector, html: html});
};

exports.readComponent = function (component) {
    const result = {
        html: this.readFile(component[0].html, 'html'),
        js: this.compileJS(component[1].js),
        css: this.compileCSS(component[2].css),
        selector: component[4].selector
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

exports.readFile = function(fileName, format) {
    try {
        const data = fs.readFileSync(`./components/${fileName}/${fileName}.${format}`, 'utf8');
        return data.toString();
    } catch(e) {
        console.log('Error:', e.stack);
    }
};