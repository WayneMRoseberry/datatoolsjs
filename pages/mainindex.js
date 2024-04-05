const loadSchemaDefs = (self) => {
    const schemadefs = getSchemaDefsEndpoint(self.value);
    var select = document.getElementById('schemalist'); select.innerHTML="";
    for (var schemadef of schemadefs) {
        var opt = document.createElement('option');
        opt.value = schemadef.name;
        opt.innerHTML = schemadef.name;
        select.appendChild(opt);
    }
};
const loadNamespaces = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "../api/namespaces", false);
    xhttp.send();
    const namespaces = JSON.parse(xhttp.responseText);
    var select = document.getElementById('namespacelist');

    var firstone = {};

    for (var namespace of namespaces) {
        var opt = document.createElement('option');
        opt.value = namespace.name;
        opt.innerHTML = namespace.name;
        select.appendChild(opt);
        if (firstone.value == null) {
            firstone.value = namespace.name;
        }
    }

    loadSchemaDefs(firstone);
};

const getSchemaDefsEndpoint = (namespace) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `../api/schemadefs?namespace=${namespace}`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};

const loadeditschemapage = () => {
    var namespace = document.getElementById('namespacelist').value;
    var schemaname = document.getElementById('schemalist').value;
    location.href = `/pages/editschema.html?namespace=${namespace}&schemaname=${schemaname}`;
};

loadNamespaces();