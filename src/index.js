import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import {Rubric, Sample} from './Model';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


const r = new Rubric({
    name: '123',
    samples: [
        {name: '321'},
        {name: '322'},
    ],
});
console.log(r +'');
