import * as PIXI from 'pixi.js';

class Tile extends PIXI.Sprite {
    constructor(texture, props) {
        super(texture);

        if(props) {
            this.walkable = props['walkable'] || true;
        }
        else {
            this.walkable = true;
        }
    }

    translate(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
}

export default Tile;