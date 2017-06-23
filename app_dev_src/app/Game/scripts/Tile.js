import * as PIXI from 'pixi.js';

class Tile extends PIXI.Sprite {
    constructor(texture, props) {
        super(texture);

        this.walkable = props['walkable'];
    }

    translate(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
}

export default Tile;