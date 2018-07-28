import React, { Component } from 'react';
import {Database, Rubric as RubricModel} from './Model';
import Rubric from './Rubric';

const path = window.require('path');
const fs = window.require('fs');
const {remote} = window.require('electron');
const Dialogs = window.require('dialogs');
const dialogs = Dialogs({cancel: 'Отмена'});

const dataPath = remote.app.getPath('userData')
const dbFile = path.join(dataPath, 'homicide.db');
const tempDbFile = path.join(dataPath, 'homicide.temp');
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
    _file: null
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

    deleteRubric = rubric => () => dialogs.confirm('Вы уверены?', sure => {
        if (sure) {
            const db = this.state.db;
            const newDb = db.update('rubrics', rs => rs.filter(r => r !== rubric));
            this.commit(newDb);
        }
    })

    setRubricId = rubricId => () => this.setState({rubricId});

    uploadDb = () =>{
        const file = this._file.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    const db = new Database(parsed);
                    this.commit(db);
                    dialogs.alert('База загружена');
                } catch (e) {
                    dialogs.alert('Файл базы повреждён');
                }
            }
            reader.readAsText(file);
        } else {
            dialogs.alert('Файл не выбран');
        }
    }

    render() {
        const rubrics = this.state.db.rubrics;
        const rubricId = this.state.rubricId;
        const dbHref = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.db));
        if (rubricId !== null) {
            return <Rubric
                saveRubric={this.changeRubric(rubricId)}
                goBack={this.setRubricId(null)}
                rubric={rubrics.get(rubricId)} />
        } else {
            return <div>
                {rubrics.map((r, i) =>
                    <p key={i}>
                        <a href='#/' onClick={this.setRubricId(i)}>{r.name}</a>
                        <button onClick={this.deleteRubric(r)}>Удалить</button>
                    </p>)}

                <button onClick={this.addRubric}>Добавить</button>
                <hr />
                <p>
                    <a href={dbHref} download="database.json">Выгрузить базу</a>
                </p>
                <p>
                    <input type='file' ref={f => this._file = f} />
                    <button onClick={this.uploadDb}>Загрузить базу</button>
                </p>
            </div>
        }
    }

}
