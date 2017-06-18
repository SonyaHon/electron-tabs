import * as PIXI from 'pixi.js';
import Tile from './Tile';

class Map {
    constructor(map_template) {
         this.width = map_template.width;
         this.height = map_template.height;

         this.Tiles = [];

         this.velocity = {
             x: 0,
             y: 0
         };

         this.offset = {
             x: 0,
             y: 0
         };

         for(let y = 0; y < this.height; y++) {
             this.Tiles.push([]);
             for(let x = 0; x < this.width; x++) {
                 let charCode = map_template.map[y][x];
                 let filename = map_template.legend[map_template.map[y][x]];

                 if(filename !== 'tile_void') {
                     let tile;
                     if(charCode[0] === '_')
                         tile = new Tile(PIXI.loader.resources[filename].texture);
                     else if(charCode[0] === '$')
                         tile = new Tile(PIXI.loader.resources[filename].texture, {
                             walkable: false
                         });
                     tile.x = x * tile.width;
                     tile.y = y * tile.height;
                     this.Tiles[y].push(tile);
                 }
                 else {
                     this.Tiles[y].push(null);
                 }
             }
         }

    }

    setVelocityX(x) {
        this.velocity.x = x;
    }

    setVelocityY(y) {
        this.velocity.y = y;
    }

    move() {
        for(let y = 0; y < this.Tiles.length; y++) {
            for(let x = 0; x < this.Tiles[y].length; x++) {
                this.Tiles[y][x].translate(this.velocity);
            }
        }
        this.offset.x += this.velocity.x;
        this.offset.y += this.velocity.y;

        return this.velocity;
    }

    addMapToStage(stage) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                if(this.Tiles[y][x] !== null)
                    stage.addChild(this.Tiles[y][x]);
            }
        }
    }

    getTileAtCoords(x, y) {
        let nX = Math.floor(x / 64);
        let nY = Math.floor(y / 64);


        if(this.Tiles[nY][nX]) {
            return this.Tiles[nY][nX];
        }
        else {
            return null;
        }

    }
    getTile(x, y) {
        if(this.Tiles[y][x])
            return this.Tiles[y][x];
        else
            return null;
    }
}

export default Map;