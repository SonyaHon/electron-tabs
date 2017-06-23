import * as PIXI from 'pixi.js';
import Tile from './Tile';

class Map {
    constructor(map_template) {
        this.width = map_template.width;
        this.height = map_template.height;

        this.Tiles = [];
        this.pathMesh = [];

        this.teamOne = {
            units: []
        };
        this.teamTwo = {
            units: []
        };
        this.gameObjects = [];
        this.units = {};

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
                        tile = new Tile(PIXI.loader.resources[filename].texture, {
                            walkable: true
                        });
                    else if(charCode[0] === '$') {
                        tile = new Tile(PIXI.loader.resources[filename].texture, {
                            walkable: false
                        });
                    }

                    tile.x = x * tile.width;
                    tile.y = y * tile.height;
                    this.Tiles[y].push(tile);
                }
                else {
                    this.Tiles[y].push(null);
                }
            }
        }


        for(let y = 0; y < this.Tiles.length * 4; y++) {
            this.pathMesh.push([]);
            for(let x = 0; x < this.Tiles[Math.floor(y / 4)].length * 4; x++) {
                let tile = this.Tiles[Math.floor(y / 4)][Math.floor(x / 4)];
                // This tile is accepted for path mesh
                if(tile !== null && tile.walkable === true) {
                    
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
    }

    addMapToStage(stage) {
        this._PARENT_STAGE = stage;
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

    addGameObject(go) {
        this.gameObjects.push(go);
        this._PARENT_STAGE.addChild(go);
    }

    addUnit(team, name, unit) {
        if(team === 'one') {
            this.teamOne.units.push(unit);
            unit.setTeam('one');
        }
        else if(team === 'two') {
            this.teamTwo.units.push(unit);
            unit.setTeam('two');
        }
        else if('neutral') {
            this.units[name] = unit;
            unit.setTeam('neutral');
        }
        else {
            throw new Error("There is no such a team");
        }
        this._PARENT_STAGE.addChild(unit);
    }

    update() {
        this.move();
        for(let key in this.gameObjects) {
            this.gameObjects[key].update();
        }
        for(let key in this.units) {
            this.units[key].update();
        }
        for(let key in this.teamOne.units) {
            this.teamOne.units[key].update();
        }
        for(let key in this.teamTwo.units) {
            this.teamTwo.units[key].update();
        }
    }
}

export default Map;