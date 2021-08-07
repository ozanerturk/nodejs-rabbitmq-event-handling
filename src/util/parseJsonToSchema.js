function parse(schema, obj) {
    for (var property in schema) {
        if (schema.hasOwnProperty(property)) {
            if (obj.hasOwnProperty(property)) {
                if (typeof schema[property] == "object" && typeof obj[property] == "object") {
                    parse(schema[property], obj[property]);
                }
                else {
                    console.log(property,schema[property])
                    schema[property] = schema[property](obj[property]);
                }
            } else {
                delete schema[property];
            }

        }
    }
}
module.exports = {
    parse: parse
};
