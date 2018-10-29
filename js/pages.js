const main = require('../index');
const build = require('./build');
const fs = require('fs');

const fileType = 'pages'

exports.render = function(component) {
    if (main.document  === '') main.document = build.createIndex();
    let html = component.html;
    html = this.replaceComponents(html);
    main.scripts += component.js;
    main.styles += component.css;
    main.document += html;
};

exports.readPage = function (pages) {
    const result = {
        html: build.readFile(fileType, pages[0].name, 'html'),
        js: build.compileJS(pages[0].name, fileType),
        css: build.compileCSS(pages[0].name, fileType)
    };

    this.render(result);
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