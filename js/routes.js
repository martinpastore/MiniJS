const main = require('../index');

exports.addRoutesManagement = function() {
    main.scripts += `
        redirect = function(uri, params, component) {
            if (uri !== history) {
                let oldUri = history;
                            
                if (component) {
                    if (component.indexOf('-') !== -1) {
                        component = component.replace(/(?:^\\w|[A-Z]|\\b\\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\\s+/g, '');
                        component = component.replace(/-/g, '');
                    }
                }
                            
                for (let i in mod) {
                    if (mod[i].route === uri) {
                        document.getElementById(mod[i].order).style.display = 'block';
                        routeParams = params;
                        history = uri;
                        if (window[component + 'OnInit']) {
                            window[component + 'OnInit']();    
                        }
                    }
                    
                    if (mod[i].route === oldUri) {
                        document.getElementById(mod[i].order).style.display = 'none';
                    }
                }
            }
    }`
};

exports.declareModules = function(modules) {
    let history = '';
    main.scripts += 'const mod = ['
    for (let i in modules) {
        if (modules[i][1].type === 'page') {
            if (history === '') {
                history = modules[i][3].route;
            }

            main.scripts += `{order: '${modules[i][2].order}', route: '${modules[i][3].route}'},`;
        }
    }
    main.scripts += '];';
    main.scripts +=  `let history = '${history}';`;
    main.scripts +=  `let routeParams = {};`;
};