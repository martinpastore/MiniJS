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
        let props = main.components[i].properties ? main.components[i].properties : null;
        while (html.indexOf(`<${main.components[i].selector}`) !== -1) {
            let src = null;
            let text = html.match(`<${main.components[i].selector} {(.*?)}>(.*?)</${main.components[i].selector}>`);
            if (text) {
                src = html.match(/{(.*?)}/).map(function(val) { return val; });
            }

            if (!text) {
                text = html.match(`<${main.components[i].selector}>(.*?)</${main.components[i].selector}>`);
            }
            text = text.map(function(val){
                return val.replace(`</${main.components[i].selector}>`,'');
            });

            if (src) {
                html = html.replace(`<${main.components[i].selector} ${src[0]}>`, main.components[i].html);
            } else {
                html = html.replace(`<${main.components[i].selector}>`, main.components[i].html);
            }
            html = html.replace(`</${main.components[i].selector}>`, '');
            if (props) {
                for (let i in props) {
                    if (src) {
                        html = html.replace(`{${props[i]}}`, text[2]);
                        html = html.replace('{src}', src[1]);
                    } else {
                        html = html.replace(`{${props[i]}}`, text[1]);
                    }
                    let t=0;
                    let word;
                    if (src) {
                        word = new RegExp(`${text[2]}`, 'g');
                    } else {
                        word = new RegExp(`${text[1]}`, 'g');
                    }
                    html = html.replace(word, function (match) {
                        t++;
                        return (t === 2) ? "" : match;
                    });
                }
            }
        }
    }
    return html;
};

exports.routing = function(component) {
        component.html = component.order === '0' ?
            component.html.replace('>', ' id="0" style="display:block;" >') :
            component.html.replace('>', ` id="${component.order}" style="display:none;" >`);
};