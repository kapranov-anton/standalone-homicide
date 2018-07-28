import {Record, fromJS, List} from 'immutable';

const populate = cls => (xs = List()) =>
    xs.map(x => new cls(x))

export const Sample = Record({
    name: '--Название--',
    investigation: '--Ситуации предварительного следствия--',
    trial: '--Ситуации судебного следствия--',
}, 'Sample');

export class Rubric extends Record({
    name: '--Название--',
    samples: List(),
}, 'Rubric') {
    constructor(params = {}) {
        super(
            fromJS(params)
            .update('samples', populate(Sample)));
    }
}

export class Database extends Record({
    rubrics: List(),
}, 'Database') {
    constructor(params = {}) {
        super(
            fromJS(params)
            .update('rubrics', populate(Rubric)));
    }
}
