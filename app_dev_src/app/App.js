import React, {Component} from 'react';
import EventEmitter from 'events';
import './App.css';

import MainGameWindow from './Game/scripts/mainGame';

class App extends Component {

    constructor(props) {
        super(props);
        this.eventEmitter = new EventEmitter();
    }

    render() {
        return (
            <div className="App">
                <MainGameWindow eventEmmiter={this.eventEmitter} />
            </div>
        );
    }
}

export default App;