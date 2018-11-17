const component = require('./js/components');
const page = require('./js/pages');
const build = require('./js/build');
const route = require('./js/routes');
const services = require('./js/services');
this.configs = require('../../burger');
this.document = '';
this.scripts = '';
this.styles = '';
this.components = [];
this.pages = [];
this.modules = [];

exports.module = function (modules) {
    route.declareModules(modules);
    services.addHttpService();
    for (let i in modules) {
        if (modules[i][1].type === 'component')
            component.readComponent(modules[i]);
        else
            page.readPage(modules[i]);
    }
    build.closeIndex();
};