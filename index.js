const component = require('./js/components');
const page = require('./js/pages');
const build = require('./js/build');
this.document = '';
this.scripts = '';
this.styles = '';
this.components = [];
this.pages = [];

exports.module = function (modules) {
    for (let i in modules) {
        if (modules[i][1].type === 'component')
            component.readComponent(modules[i]);
        else
            page.readPage(modules[i]);
    }
    build.closeIndex();
};
