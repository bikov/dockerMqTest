let parser = require('graphql/language');
let validator = require('graphql/validation');


 function validateQuery(schema, query) {
     return validator.validate(schema, parser.parse(query));
}

module.exports = {
    "validateQuery": validateQuery
};