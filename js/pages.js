const main = require('../index');
const build = require('./build');

exports.render = function(component) {
    if (main.document  === '') main.document = build.createIndex();

    this.routing(component);

    let html = component.html;
    html = this.replaceComponents(html);
    main.scripts += component.js;
    main.styles += component.css;
    main.document += html;
};

exports.readPage = function (pages) {
    const result = {
        html: build.readFile(main.configs.pages, pages[0].name, 'html'),
        js: build.compileJS(pages[0].name, main.configs.pages),
        css: build.compileCSS(pages[0].name, main.configs.pages),
        order: pages[2].order
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

exports.routing = function(component) {
        component.html = component.order === '0' ?
            component.html.replace('>', ' id="0" style="display:block;" >') :
            component.html.replace('>', ` id="${component.order}" style="display:none;" >`);
};