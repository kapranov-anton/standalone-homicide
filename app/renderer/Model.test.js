import {Database, Rubric, Sample} from './Model';

const db = {
	rubrics: [
		{name: 'rub1', samples: []},
		{name: 'rub2', samples: [{
			name: 'samp1',
			investigation: 'inv1',
			trial: 'trial1',
		}]},
	],
}

it('deserialize', () => {
	const deserialized = new Database(db);
	const rs = deserialized.rubrics;
	expect(rs.first().name).toEqual(db.rubrics[0].name);
	expect(rs.get(1).samples.first().trial).toEqual(db.rubrics[1].samples[0].trial);
});

it('serialize', () => {
	const deserialized = new Database(db);
	const newRubric = new Rubric({name: 'newRub'});
	const serialized = deserialized
		.update('rubrics', rs => rs.push(newRubric))
		.toJS();
	expect(serialized.rubrics[2].name).toBe(newRubric.name);
});

it('create empty', () => {
	const db = new Database();
	expect(db.rubrics.size).toEqual(0);
});

