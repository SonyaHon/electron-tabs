import * as PIXI from 'pixi.js';
import EventEmitter from 'events';

class GameObject extends PIXI.Sprite {
    constructor(texture, eventEmitter, map) {
        super(PIXI.loader.resources[texture].texture);
        this.eventEmitter = eventEmitter;
        this.selfEventEmitter = new EventEmitter();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.map = map;
    }

    updateCoords() {
        this.x += this.map.velocity.x;
        this.y += this.map.velocity.y;
    }
}

export default GameObject;