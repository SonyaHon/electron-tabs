import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/mainGame.css';

import * as PIXI from 'pixi.js';

import Map from './Map';
import KeyBoardControll from './KeyBoardControll';
import SampleUnit from './SampleUnit.js';

class MainGameWindow extends Component {

    constructor(props) {
        super(props);

        this.gui = []; // Just simple sprites for effects etc.
        this.maps = []; // maps

        this.gui['loader-static-text'] = new PIXI.Text('Loading...');
        this.gui['loader-static-text'].style._fill = "white";
        this.gui['loader-static-text'].anchor.x = 0.5;
        this.gui['loader-static-text'].anchor.y = 0.5;


        this.currentStage = null; // Current game stage.

    }

    render() {
        return (
            <div className="MainGameWindow" ref="main_game_div">
            </div>
        );
    }

    progressLoading(loader) {
        if(this.gui['loader-%-text']) {
            this.gui['loader-%-text'].text = loader.progress + '%';
        }
    }


    // Set up Game stage here
    setupGameStage() {

        // Setting map
        this.maps['map-01'] = new Map(this.props.maps[0]);
        this.maps['map-01'].addMapToStage(this.gameStage);

        //Setting map movement
        let self = this;
        this.Keyboard.on('s_pressed', function () {
            self.maps['map-01'].setVelocityY(-10);
        });
        this.Keyboard.on('w_pressed', function () {
            self.maps['map-01'].setVelocityY(10);
        });
        this.Keyboard.on('a_pressed', function () {
            self.maps['map-01'].setVelocityX(10);
        });
        this.Keyboard.on('d_pressed', function () {
            self.maps['map-01'].setVelocityX(-10);
        });
        this.Keyboard.on('s_released', function () {
            self.maps['map-01'].setVelocityY(0);
        });
        this.Keyboard.on('w_released', function () {
            self.maps['map-01'].setVelocityY(0);
        });
        this.Keyboard.on('a_released', function () {
            self.maps['map-01'].setVelocityX(0);
        });
        this.Keyboard.on('d_released', function () {
            self.maps['map-01'].setVelocityX(0);
        });

        this.maps['map-01'].addUnit('one', '', new SampleUnit('tface', this.props.eventEmitter, this.maps['map-01'], {
            x: (128*4 + 32),
            y: (128 + 32),
            attackRadius: 1
        }));

        this.maps['map-01'].addUnit('two', '', new SampleUnit('tface', this.props.eventEmitter, this.maps['map-01'], {
            x: (128*4 + 32),
            y: (128*4 + 32),
            attackRadius: 1
        }));

        this.renderer.render(this.gameStage);
        this.currentStage = this.gameStage;
    }

    mainLoop() {
        requestAnimationFrame(this.mainLoop.bind(this));
        if(this.gui['loader-sprite']) {
            this.gui['loader-sprite'].rotation += 0.1;
        }

        if(this.maps['map-01']) {
           this.maps['map-01'].update();
        }
        this.renderer.render(this.currentStage);
    }

    componentDidMount() {
        // Setting up PIXI
        this.renderer = new PIXI.autoDetectRenderer(this.props.app_config['screen-width'], this.props.app_config['screen-height']);
        this.refs.main_game_div.appendChild(this.renderer.view);

        //Setting up game stages
        this.loadingStage = new PIXI.Container();
        this.gameStage = new PIXI.Container();

        //Load loading image;
        let self = this;
        PIXI.loader
            .add('loading-image', './assets/loader.png', () => {
                // Setting up loader
                // Setting up loader image
                self.gui['loader-sprite'] = new PIXI.Sprite(PIXI.loader.resources['loading-image'].texture);
                self.gui['loader-sprite'].anchor.x = 0.5;
                self.gui['loader-sprite'].anchor.y = 0.5;
                self.gui['loader-sprite'].x = self.renderer.width * 0.5 + 100;
                self.gui['loader-sprite'].y = self.renderer.height * 0.5;
                self.gui['loader-sprite'].scale.set(0.3, 0.3);
                //Setting up loader static text
                self.gui['loader-static-text'].x = self.renderer.width * 0.5 - 100;
                self.gui['loader-static-text'].y = self.renderer.height* 0.5;
                //Setting up loader % text;
                self.gui['loader-%-text'] = new PIXI.Text('0%');
                self.gui['loader-%-text'].style._fill = "white";
                self.gui['loader-%-text'].anchor.x = 0.5;
                self.gui['loader-%-text'].anchor.y = 0.5;
                self.gui['loader-%-text'].x = self.renderer.width * 0.5 + 100;
                self.gui['loader-%-text'].y = self.renderer.height * 0.5;
                self.loadingStage.addChild(self.gui['loader-%-text']);
                self.loadingStage.addChild(self.gui['loader-static-text']);
                self.loadingStage.addChild(self.gui['loader-sprite']);
                self.renderer.render(self.loadingStage);
                self.currentStage = self.loadingStage;
                setTimeout((self.mainLoop.bind(self))(), 100);
            })
            .add('tile_grass', './assets/tile_grass.png')
            .add('tile_x', './assets/til4.png')
            .add('tface', './assets/tface.png')
            .on('progress', this.progressLoading.bind(this))
            .load(this.setupGameStage.bind(this));

        this.Keyboard = new KeyBoardControll();
    }
}

function mapStateToProps(state) {
    return {
        app_config: state.config,
        maps: state.maps
    };
}

export default connect(mapStateToProps)(MainGameWindow);