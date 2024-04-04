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
    var exampleNumberInput = Number(document.getElementById('numberofexamples').value)

    var randomexample = getRandomExampleEndpoint(namespace, schemaName, exampleNumberInput);

    var randomelement = document.getElementById('randomexamples');
    randomelement.innerHTML = "";
    var blob = '';
    var blobrowctr = 0;
    for (var example of randomexample) {
        blob = blob + `<span id="randexample_${blobrowctr}">${example.ExampleValue}</span><br/>`;
        blobrowctr++;
    }
    randomelement.innerHTML = `${blob}`;


    var schemaDefJson = getSchemaDefDOTEndpoint(namespace, schemaName);
    loadDOTGraph(schemaDefJson);
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
    return xhttp.responseText;
};

const getRandomExampleEndpoint = (namespace, schemaname, count) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `../api/schemadef/getrandomexample?namespace=${namespace}&schemaname=${schemaname}&count=${count}`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};