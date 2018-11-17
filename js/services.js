const main = require('../index');

exports.addHttpService = function () {
    main.scripts += `
        httpRequest = function(method, url, type) {
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
    
                xhr.send();
            });
        };
    `;
};