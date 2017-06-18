import * as PIXI from 'pixi.js';

class GameObject extends PIXI.Sprite {
    constructor(texture, eventEmitter, map) {
        super(PIXI.loader.resources[texture].texture);
        this.eventEmitter = eventEmitter;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }

    updateCoords(ch) {
        this.x += ch.x;
        this.y += ch.y;
    }
}

export default GameObject;