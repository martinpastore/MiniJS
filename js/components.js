exports.render = function(father) {
    document.getElementById(father).innerHTML += html;
}

exports.readComponent = function (componentName) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        this.components.push({
            name: componentName,
            html: this.responseText,
            selector: `c-${componentName}`
        });
        console.log(this.components);
      }
    };
    xhttp.open("GET", `components/${componentName}/_${componentName}.html`, true);
    xhttp.send();
}

exports.readFatherFile = function (file) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        this.foundAndReplaceSelector(this.responseText);
      }
    };
    xhttp.open("GET", `pages/${file}/_${file}.html`, true);
    xhttp.send();
}

exports.foundAndReplaceSelector = function (html, selector) {
    if (html.indexOf(selector) !== -1) {
        html.replace(/selector/g, this.components[selector.replace('c-', '')]);
    }
}