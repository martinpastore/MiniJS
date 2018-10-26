const component = require('./js/components');

exports.render = function(comp) {
    component.readComponent(comp);
};

exports.module = function (modules) {
    for (let i in modules) {
        component.readComponent(modules[i]);
    }
    component.closeIndex();
}