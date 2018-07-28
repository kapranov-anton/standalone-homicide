import React, { Component } from 'react';
import {Sample as SampleModel} from './Model';
import Sample from './Sample';

const Dialogs = window.require('dialogs');
const dialogs = Dialogs({cancel: 'Отмена'});

export default class Rubric extends Component {
    state = {
        sampleId: null,
    }

    addSample = () => dialogs.prompt('Название', name => {
        if (name) {
            const rubric = this.props.rubric;
            const sample = new SampleModel({name});
            const newRubric = rubric.update('samples', ss => ss.push(sample));
            this.props.saveRubric(newRubric);
        }
    });

    deleteSample = sample => () => dialogs.confirm('Вы уверены?', shure => {
        if (shure) {
            const rubric = this.props.rubric;
            const newRubric = rubric.update('samples', ss => ss.filter(s => s !== sample));
            this.props.saveRubric(newRubric);
        }
    })


    changeSample = sampleId => newSample => {
        const rubric = this.props.rubric;
        const newRubric = rubric.update('samples', ss => ss.set(sampleId, newSample));
        this.props.saveRubric(newRubric);
    };

    setSampleId = sampleId => () => this.setState({sampleId});

    render() {
        const {goBack, rubric} = this.props;
        const sampleId = this.state.sampleId;
        if (sampleId !== null) {
            return <Sample
                saveSample={this.changeSample(sampleId)}
                goBack={this.setSampleId(null)}
                sample={rubric.samples.get(sampleId)} />
        }
        return <div>
            <a href='#/' onClick={goBack}>← Вернуться</a>
            <h1>{rubric.name}</h1>
            {rubric.samples.map((s, i) =>
                <p key={i}>
                    <a href='#/' onClick={this.setSampleId(i)}>{s.name}</a>
                    <button onClick={this.deleteSample(s)}>Удалить</button>
                </p>)}

            <button onClick={this.addSample}>Добавить</button>
        </div>
    }
}
