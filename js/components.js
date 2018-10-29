const main = require('../index');
const build = require('./build');

exports.render = function(component) {
    const html = component.html;
    main.scripts += component.js;
    main.styles += component.css;
    main.components.push({selector: component.selector, html: html});
};

exports.readComponent = function (component) {
    const result = {
        html: build.readFile(main.configs.components, component[0].name, 'html'),
        js: build.compileJS(component[0].name, main.configs.components),
        css: build.compileCSS(component[0].name, main.configs.components),
        selector: component[2].selector
    };

    this.render(result);
};