const loadControls = () => {
    var params = {};
    var pairs = location.search.split("?").pop().split("&");
    for (var i = 0; i < pairs.length; i++) {
        var p = pairs[i].split("=");
        params[p[0]] = p[1];
    }

    var nameSpace = params['namespace'];
    var schemadefname = params['schemaname'];
    var sd = document.getElementById('schemadefjson');
    var schemaJson = getSchemaDefEndpoint(nameSpace, schemadefname);
    var jsontext = JSON.stringify(schemaJson, null, 2);
    sd.value = jsontext;
};

const getSchemaDefEndpoint = (namespace, schemaname) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `../api/schemadef?namespace=${namespace}&schemaname=${schemaname}`, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
};

const saveSchemaDef = () => {
    var params = {};
    var pairs = location.search.split("?").pop().split("&");
    for (var i = 0; i < pairs.length; i++) {
        var p = pairs[i].split("=");
        params[p[0]] = p[1];
    }

    var namespace = params['namespace'];
    var schemadefname = params['schemaname'];
    const xhttp = new XMLHttpRequest();
    var schemaJson = document.getElementById('schemadefjson').value;
    xhttp.open("POST", `../api/schemadef?namespace=${namespace}&schemaname=${schemadefname}`, false);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhttp.send(schemaJson);
    return xhttp.responseText;
};

loadControls();