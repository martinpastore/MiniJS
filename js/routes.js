const main = require('../index');

exports.addRoutesManagement = function() {
    main.scripts += `
        redirect = function(uri) {
            
            let oldUri = history;
                        
            for (let i in mod) {
                if (mod[i].route === uri) {
                    document.getElementById(mod[i].order).style.display = 'block';
                    history = uri;
                }
                
                if (mod[i].route === oldUri) {
                    document.getElementById(mod[i].order).style.display = 'none';
                }
            }
    }`
}

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
}