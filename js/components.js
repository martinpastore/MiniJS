const main = require('../index');
var fs = require('fs');

exports.render = function(component) {
    const html = component.html;
    main.scripts += component.js;
    main.styles += component.css;
    main.components.push({selector: component.selector, html: html});
};

exports.readComponent = function (component) {
    const result = {
        html: this.readFile(component[0].name, 'html'),
        js: this.compileJS(component[0].name),
        css: this.compileCSS(component[0].name),
        selector: component[2].selector
    };

    this.render(result);
};

exports.compileCSS = function(css) {
    const script = this.readFile(css, 'css');
    return script;
};

exports.compileJS = function(js) {
    const script = this.readFile(js, 'js');
    return script;
};

exports.readFile = function(fileName, format) {
    try {
        const data = fs.readFileSync(`./components/${fileName}/${fileName}.${format}`, 'utf8');
        return data.toString();
    } catch(e) {
        console.log('Error:', e.stack);
    }
};