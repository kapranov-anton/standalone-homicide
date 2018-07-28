import React, { Component } from 'react';
import Markdown from 'react-markdown';

class Editor extends Component {
    _textarea: null

    state = {
        edit: false,
    }

    render() {
        const edit = this.state.edit;
        const {value, onSave} = this.props;
        if (edit) {
            return <div>
                <textarea defaultValue={value} ref={t => this._textarea = t}/>
                <button onClick={() => {
                    this.setState({edit: false});
                    onSave(this._textarea.value);
                }}>Сохранить</button>
            </div>
        } else {
            return <div>
                <Markdown source={value} />
                <button onClick={() => this.setState({edit: true})}>Изменить</button>
            </div>
        }
    }
}

export default class Sample extends Component {
    onSave = fieldName => value =>
        this.props.saveSample(this.props.sample.set(fieldName, value));

    render() {
        const {goBack, sample} = this.props;
        return <div>
            <a href='#/' onClick={goBack}>← Вернуться</a>
            <h1>{sample.name}</h1>
            <Editor value={sample.investigation} onSave={this.onSave('investigation')} />
            <Editor value={sample.trial} onSave={this.onSave('trial')} />
        </div>
    }
}
