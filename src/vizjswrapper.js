import { instance } from "@viz-js/viz";
function loadDOTGraph (s) {
    instance().then(viz => {

        var dotspot = document.getElementById("dotimage");
        dotspot.innerHTML = '';
        dotspot.appendChild(viz.renderSVGElement(s))
    });
}



var schemaList = document.getElementById("schemalist");
schemaList.addEventListener("change", function (evt) {
    var schemaName = evt.target.value;
    var namespace = document.getElementById('namespacelist').value;

    var schemaDef = getSchemaDefEndpoint(namespace, schemaName);
    var jsontext = JSON.stringify(schemaDef, null, 2);
    var schemaBlob = document.getElementById('schemablob');
    schemaBlob.innerHTML = `<pre>${jsontext}</pre>`;

    var randomexample = getRandomExampleEndpoint(namespace, schemaName);

    var randomjson = JSON.stringify(randomexample, null, 2);
    var randomelement = document.getElementById('randomexamples');
    randomelement.innerHTML = "";
    var blob = '';
        for (var example of randomexample) {
        blob = blob + `<tr><td>value:&nbps;</td><td>${example.ExampleValue}</td?</tr>`;
    }
    randomelement.innerHTML = `<table>${blob}</table>`;


    var schemaDefJson = getSchemaDefDOTEndpoint(namespace, schemaName);
    var dotElement = document.getElementById("dot");
    dotElement.innerText = schemaDefJson;
});


const getSchemaDefEndpoint = (namespace, schemaname) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `../api/schemadef?namespace=${namespace}&schemaname=${schemaname}`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};

const getSchemaDefDOTEndpoint = (namespace, schemaname) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `../api/schemadef/dot?namespace=${namespace}&schemaname=${schemaname}`, false);
    xhttp.send();
    loadDOTGraph( xhttp.responseText);
};

const getRandomExampleEndpoint = (namespace, schemaname) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `../api/schemadef/getrandomexample?namespace=${namespace}&schemaname=${schemaname}&count=10`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};