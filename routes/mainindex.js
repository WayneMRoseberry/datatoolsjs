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
    xhttp.open("GET", "http://localhost:1337/api/namespaces", false);
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

const loadSchemaDef = (self) => {
    var schemaName = self.value;
    var namespace = document.getElementById('namespacelist').value;
    var schemaDef = getSchemaDefEndpoint(namespace, schemaName);
    var jsontext = JSON.stringify(schemaDef,null,2);
    var schemaBlob = document.getElementById('schemablob');
    schemaBlob.innerHTML = `<pre>${jsontext}</pre>`;

    var randomexample = getRandomExampleEndpoint(namespace, schemaName);

    var randomjson = JSON.stringify(randomexample, null, 2);
    var randomelement = document.getElementById('randomexamples');
    randomelement.innerHTML = "";
    for (var example of randomexample) {
        randomelement.innerHTML = randomelement.innerHTML + `<span>${example.ExampleValue}</span><br/>`;
    }

    //randomelement.innerHTML = `<pre>${randomjson}</pre>`;
};

const getSchemaDefsEndpoint = (namespace) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:1337/api/schemadefs?namespace=${namespace}`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};

const getSchemaDefEndpoint = (namespace, schemaname) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:1337/api/schemadef?namespace=${namespace}&schemaname=${schemaname}`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};

const getRandomExampleEndpoint = (namespace, schemaname) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:1337/api/schemadef/getrandomexample?namespace=${namespace}&schemaname=${schemaname}&count=10`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};

loadNamespaces();