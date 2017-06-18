// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

// Components
import App from './app/App';

// Reducers
import rAll from './reducers/index';

function loadFileFromServer(filename) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', filename, false);
    xhr.send();
    return JSON.parse(xhr.response);
}

let preState = {};


preState.config = loadFileFromServer('config.json');
preState.maps = loadFileFromServer('maps.json');


const store = createStore(rAll, preState);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('root'));