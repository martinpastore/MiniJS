const main = require('../index');

exports.addRoutesManagement = function() {
    main.scripts += `
        redirect = function(uri, params) {
            let oldUri = history;
            let component = uri.replace('/', '');
            if (component) {
                if (component.indexOf('-') !== -1) {
                    component = component.replace(/(?:^\\w|[A-Z]|\\b\\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\\s+/g, '');
                    component = component.replace(/-/g, '');
                }
            }
                        
            for (let i in mod) {
                if (mod[i].route === uri) {
                    document.getElementById(mod[i].order).style.display = 'block';
                    window.location.hash = mod[i].route.replace('/', '#');
                    routeParams = params;
                    history = uri;
                    if (window[component + 'OnInit']) {
                        window[component + 'OnInit']();
                    }
                }
                
                if (mod[i].route === oldUri && oldUri !== uri) {
                    document.getElementById(mod[i].order).style.display = 'none';
                }
            }
    }`
};

exports.hashReaction = function () {
    main.scripts += `
        window.onhashchange = function () {
            let hash = window.location.hash;
            hash = hash.replace('#', '');
            
            let c = 0;
            for (let i in mod) {
                const route = mod[i].route.replace('/', '');
                if (route === hash) {
                    redirect(mod[i].route);
                    c++;
                }
            }

            if (c === 0) {
                redirect('/404');
            }
        }
    `;
}

exports.hashCheck = function () {
    main.scripts += `
        window.onload = function () {
            let hash = window.location.hash;
            hash = hash.replace('#', '');
            
            for (let i in mod) {
                const route = mod[i].route.replace('/', '');
                if (route === hash) {
                    redirect(mod[i].route);
                }
            }
        }
    `;
}

exports.declareModules = function(modules) {
    let history = '';
    main.scripts += 'const mod = [';
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