const api = require('../routes/api');
const CommonSchema = require('../datamakerlibs/commonschema');
const { INVALIDNAME } = require('../datamakerlibs/namevalidation');

// sends a fake request through the api router and resolves with what the router did with it
function sendRequest(method, url, query, body) {
    return new Promise((resolve) => {
        var res = {
            statusCode: 200,
            status: function (code) { this.statusCode = code; return this; },
            send: function (data) { resolve({ handled: true, status: this.statusCode, data: data }); },
            writeHead: function (code) { this.statusCode = code; },
            end: function (data) { resolve({ handled: true, status: this.statusCode, data: data }); }
        };
        var req = { method: method, url: url, query: query, body: body, headers: { host: "localhost" }, protocol: "http" };
        api.handle(req, res, function (err) { resolve({ handled: false, error: err }); });
    });
}

describe('api test suite', function () {

    var providerCalls;

    beforeEach(() => {
        providerCalls = [];
        var provider = {
            Namespaces: function () { providerCalls.push("Namespaces"); return []; },
            SchemaDefs: function (namespace) { providerCalls.push("SchemaDefs"); return []; },
            getSchemaDef: function (namespace, schemaName) { providerCalls.push("getSchemaDef"); return new CommonSchema.SchemaDef(schemaName, new CommonSchema.StaticSchemaObject("val1"), namespace); },
            addSchemaDef: function (schemaDef) { providerCalls.push("addSchemaDef"); }
        };
        api.configure({ getSchemaProvider: () => provider, getDecider: () => null });
    });

    describe('query name validation subsuite', function () {

        it.each(["/schemadefs", "/schemadef", "/schemadef/dot", "/schemadef/getrandomexample"])
            ("GET %s - invalid namespace - 400 and provider not called", async function (path) {
                var result = await sendRequest("GET", `${path}?namespace=x`, { namespace: "a'b", schemaname: "schema1" });
                expect(result.status).toEqual(400);
                expect(result.data.error).toEqual(`invalid namespace: ${INVALIDNAME}`);
                expect(providerCalls).toEqual([]);
            });

        it.each(["/schemadef", "/schemadef/dot", "/schemadef/getrandomexample"])
            ("GET %s - invalid schemaname - 400 and provider not called", async function (path) {
                var result = await sendRequest("GET", `${path}?namespace=x`, { namespace: "namespace1", schemaname: "<script>" });
                expect(result.status).toEqual(400);
                expect(result.data.error).toEqual(`invalid schemaname: ${INVALIDNAME}`);
                expect(providerCalls).toEqual([]);
            });

        it.each([[["a", "b"]], [{ x: "1" }], [""], ["a".repeat(65)]])
            ("GET /schemadef - namespace %j - 400", async function (namespace) {
                var result = await sendRequest("GET", "/schemadef?namespace=x", { namespace: namespace, schemaname: "schema1" });
                expect(result.status).toEqual(400);
                expect(providerCalls).toEqual([]);
            });

        it("GET /schemadef - valid names - 200 and provider called", async function () {
            var result = await sendRequest("GET", "/schemadef?namespace=x", { namespace: "namespace-1", schemaname: "schema_1" });
            expect(result.status).toEqual(200);
            expect(result.data.SchemaName).toEqual("schema_1");
            expect(providerCalls).toEqual(["getSchemaDef"]);
        });

        it("GET /namespaces - no name parameters - 200", async function () {
            var result = await sendRequest("GET", "/namespaces", {});
            expect(result.status).toEqual(200);
            expect(providerCalls).toEqual(["Namespaces"]);
        });
    });

    describe('POST schemadef name validation subsuite', function () {

        it("POST /schemadef - invalid Namespace - 400 and not added", async function () {
            var schemaDef = new CommonSchema.SchemaDef("schema1", new CommonSchema.StaticSchemaObject("val1"), "bad name");
            var result = await sendRequest("POST", "/schemadef", {}, schemaDef);
            expect(result.status).toEqual(400);
            expect(result.data.error).toEqual(`invalid schema: ${INVALIDNAME}`);
            expect(providerCalls).not.toContain("addSchemaDef");
        });

        it("POST /schemadef - invalid SchemaName - 400 and not added", async function () {
            var schemaDef = new CommonSchema.SchemaDef("x'; DROP TABLE schemas;--", new CommonSchema.StaticSchemaObject("val1"), "namespace1");
            var result = await sendRequest("POST", "/schemadef", {}, schemaDef);
            expect(result.status).toEqual(400);
            expect(providerCalls).not.toContain("addSchemaDef");
        });

        it("POST /schemadef - invalid name in nested reference - 400 and not added", async function () {
            var reference = new CommonSchema.ReferenceSchemaObject("namespace2", "../schema2");
            var schemaDef = new CommonSchema.SchemaDef("schema1", new CommonSchema.ChoiceSchemaObject(["x", reference]), "namespace1");
            var result = await sendRequest("POST", "/schemadef", {}, schemaDef);
            expect(result.status).toEqual(400);
            expect(result.data.error).toEqual(`invalid schema: ${INVALIDNAME}`);
            expect(providerCalls).not.toContain("addSchemaDef");
        });

        it("POST /schemadef - valid names - added", async function () {
            var schemaDef = new CommonSchema.SchemaDef("schema1", new CommonSchema.StaticSchemaObject("val1"), "namespace1");
            var result = await sendRequest("POST", "/schemadef", {}, schemaDef);
            expect(result.status).toEqual(200);
            expect(providerCalls).toContain("addSchemaDef");
        });
    });
});
