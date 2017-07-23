import React, { Component } from 'react';
import {Database, Rubric as RubricModel} from './Model';
import './App.css';
import Rubric from './Rubric';

const path = window.require('path');
const fs = window.require('fs');
const {remote} = window.require('electron');
const Dialogs = window.require('dialogs');
const dialogs = Dialogs({cancel: 'Отмена'});

const dbFile = path.join(remote.app.getAppPath(), 'homicide.db');
const tempDbFile = path.join(remote.app.getAppPath(), 'homicide.temp');
const loadDb = () =>
    new Database(
        fs.existsSync(dbFile)
        ? JSON.parse(fs.readFileSync(dbFile))
        : {});

const saveDb = db => {
    fs.writeFileSync(tempDbFile, JSON.stringify(db));
    fs.renameSync(tempDbFile, dbFile);
}


export default class App extends Component {
    state = {
        db: new Database(),
        rubricId: null,
    }

    componentDidMount() {
        this.setState({db: loadDb()});
    }

    commit = db => {
        this.setState({db}, () => saveDb(db));
    }

    addRubric = () => dialogs.prompt('Название', name => {
        if (name) {
            const db = this.state.db;
            const rubric = new RubricModel({name});
            const newDb = db.update('rubrics', rs => rs.push(rubric));
            this.commit(newDb);
        }
    });

    changeRubric = rubricId => newRubric => {
        const db = this.state.db;
        const newDb = db.update('rubrics', rs => rs.set(rubricId, newRubric));
        this.commit(newDb);
    };

    deleteRubric = rubric => () => dialogs.confirm('Вы уверены?', shure => {
        if (shure) {
            const db = this.state.db;
            const newDb = db.update('rubrics', rs => rs.filter(r => r !== rubric));
            this.commit(newDb);
        }
    })

    setRubricId = rubricId => () => this.setState({rubricId});

    render() {
        const rubrics = this.state.db.rubrics;
        const rubricId = this.state.rubricId;
        if (rubricId !== null) {
            return <Rubric
                saveRubric={this.changeRubric(rubricId)}
                goBack={this.setRubricId(null)}
                rubric={rubrics.get(rubricId)} />
        }

        return <div>
            {rubrics.map((r, i) =>
                <p key={i}>
                    <a href='#/' onClick={this.setRubricId(i)}>{r.name}</a>
                    <button onClick={this.deleteRubric(r)}>Удалить</button>
                </p>)}

            <button onClick={this.addRubric}>Добавить</button>
        </div>
    }

}
