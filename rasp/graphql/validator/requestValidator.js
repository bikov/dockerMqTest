let validator = require('graphql/validation');
let parser = require('graphql/language');


 function validateQuery(schema, query) {
    let errors = validator.validate(schema, parser.parse(query));
    return errors.length <= 0;
}

module.exports = {
    "validateQuery": validateQuery
};