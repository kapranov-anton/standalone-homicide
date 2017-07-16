import {Record, fromJS, List} from 'immutable';

export class Rubric extends Record({
    name: '--Название--',
    samples: List(),
}, 'Rubric') {
    constructor(params) {
        super(
            fromJS(params)
            .update('samples', ss => ss.map(s => new Sample(s))));
    }
}

export const Sample = Record({
    name: '--Название--',
    investigation: '--Ситуации предварительного следствия--',
    trial: '--Ситуации судебного следствия--',
}, 'Sample');

