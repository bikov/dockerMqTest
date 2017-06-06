import {validate} from 'graphql/validation';
import {parse} from 'graphql/language';


export function validateQuery(schema, query) {
    let errors = validate(schema, parse(query));
    return errors.length <= 0;
}