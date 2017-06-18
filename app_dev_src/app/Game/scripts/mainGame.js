import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../css/mainGame.css';

import * as PIXI from 'pixi.js';

import Map from './Map';
import KeyBoardControll from './KeyBoardControll';
import Unit from './Unit';

class MainGameWindow extends Component {

    constructor(props) {
        super(props);

        this.sprites = []; // Just simple sprites for effects etc.
        this.gameObjects = []; // Single game object which need unique id
        this.units = []; // All units

        this.sprites['loader-static-text'] = new PIXI.Text('Loading...');
        this.sprites['loader-static-text'].style._fill = "white";
        this.sprites['loader-static-text'].anchor.x = 0.5;
        this.sprites['loader-static-text'].anchor.y = 0.5;


        this.currentStage = null; // Current game stage.

    }

    render() {
        return (
            <div className="MainGameWindow" ref="main_game_div">
            </div>
        );
    }

    progressLoading(loader) {
        if(this.sprites['loader-%-text']) {
            this.sprites['loader-%-text'].text = loader.progress + '%';
        }
    }


    // Set up Game stage here
    setupGameStage() {

        // Setting map
        this.gameObjects['map-01'] = new Map(this.props.maps[0]);
        this.gameObjects['map-01'].addMapToStage(this.gameStage);

        //Setting map movement
        let self = this;
        this.Keyboard.on('s_pressed', function () {
            self.gameObjects['map-01'].setVelocityY(-10);
        });
        this.Keyboard.on('w_pressed', function () {
            self.gameObjects['map-01'].setVelocityY(10);
        });
        this.Keyboard.on('a_pressed', function () {
            self.gameObjects['map-01'].setVelocityX(10);
        });
        this.Keyboard.on('d_pressed', function () {
            self.gameObjects['map-01'].setVelocityX(-10);
        });
        this.Keyboard.on('s_released', function () {
            self.gameObjects['map-01'].setVelocityY(0);
        });
        this.Keyboard.on('w_released', function () {
            self.gameObjects['map-01'].setVelocityY(0);
        });
        this.Keyboard.on('a_released', function () {
            self.gameObjects['map-01'].setVelocityX(0);
        });
        this.Keyboard.on('d_released', function () {
            self.gameObjects['map-01'].setVelocityX(0);
        });

        this.Keyboard.on('f_pressed', function () {
            console.log("Pressed");
           self.units['asd'].getNeighboors(self.units['asd'].x, self.units['asd'].y);
        });

        this.units['asd'] = new Unit('tface', this.props.eventEmitter, this.gameObjects['map-01'], {
            x: (128 + 32),
            y: (128 + 32)
        });

        this.gameStage.addChild(this.units['asd']);
        this.renderer.render(this.gameStage);
        this.currentStage = this.gameStage;
    }

    mainLoop() {
        requestAnimationFrame(this.mainLoop.bind(this));
        if(this.sprites['loader-sprite']) {
            this.sprites['loader-sprite'].rotation += 0.1;
        }



        if(this.gameObjects['map-01']) {
            let ch = this.gameObjects['map-01'].move();
            for(let key in this.units) {
                this.units[key].updateCoords(ch);
            }
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
                // Setting up loader image
                self.sprites['loader-sprite'] = new PIXI.Sprite(PIXI.loader.resources['loading-image'].texture);
                self.sprites['loader-sprite'].anchor.x = 0.5;
                self.sprites['loader-sprite'].anchor.y = 0.5;
                self.sprites['loader-sprite'].x = self.renderer.width * 0.5 + 100;
                self.sprites['loader-sprite'].y = self.renderer.height * 0.5;
                self.sprites['loader-sprite'].scale.set(0.3, 0.3);
                //Setting up loader static text
                self.sprites['loader-static-text'].x = self.renderer.width * 0.5 - 100;
                self.sprites['loader-static-text'].y = self.renderer.height* 0.5;
                //Setting up loader % text;
                self.sprites['loader-%-text'] = new PIXI.Text('0%');
                self.sprites['loader-%-text'].style._fill = "white";
                self.sprites['loader-%-text'].anchor.x = 0.5;
                self.sprites['loader-%-text'].anchor.y = 0.5;
                self.sprites['loader-%-text'].x = self.renderer.width * 0.5 + 100;
                self.sprites['loader-%-text'].y = self.renderer.height * 0.5;

                self.loadingStage.addChild(self.sprites['loader-%-text']);
                self.loadingStage.addChild(self.sprites['loader-static-text']);
                self.loadingStage.addChild(self.sprites['loader-sprite']);
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