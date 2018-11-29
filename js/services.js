const main = require('../index');

exports.addHttpService = function () {
    main.scripts += `
        httpRequest = function(method, url, body, type) {
            return new Promise (function (resolve, reject){
                var xhr = new XMLHttpRequest();
    
                if (type) {
                    xhr.overrideMimeType(type);
                }
    
                xhr.open(method, url);
    
                xhr.onload = function() {
                    resolve(xhr.responseText);
                };
    
                xhr.onerror = function() {
                    reject(xhr.responseText);
                };
                
                if (!body) {
                    xhr.send();
                } else {
                    xhr.setRequestHeader('Content-type', 'application/json')
                    xhr.send(JSON.stringify(body));
                }
            });
        };
    `;
};