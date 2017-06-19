import {validator} from 'graphql/validation';
let parser = require('graphql/language');


 function validateQuery(schema, query) {
     return validator.validate(schema, parser.parse(query));
}

module.exports = {
    "validateQuery": validateQuery
};