exports.request = (method, url, type) => {
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
}
