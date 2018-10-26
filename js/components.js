exports.render = function(component) {
    const html = component.html + component.js + component.css;
    document.getElementById('burgerjs-app').innerHTML += html;
};

exports.readComponent = function (component) {
    const result = {
        html: component[0],
        js: component[1],
        css: component[2]
    };

    result.css = this.compileCSS(result.css);
    result.js = this.compileJS(result.js);

    this.render(result);
};

exports.compileCSS = function(css) {
    return `<style>${css}</style>`
};

exports.compileJS = function(js) {
    return `<script>${js}</script>`
};