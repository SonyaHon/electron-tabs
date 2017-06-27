import * as PIXI from 'pixi.js';
import Tile from './Tile';
import PathMesh from './PathMesh';

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

        // Added all posible points with duplicats
        for(let y = 0; y < this.Tiles.length; y++) {
            for(let x = 0; x < this.Tiles[y].length; x++) {
                let tile = this.Tiles[y][x];
                if(tile !== null && tile.walkable === true) {
                    // This tile should be added to the tiles grid
                    let p1 = {x: tile.x, y: tile.y, f: 0, g: 0, h: 0};
                    let p2 = {x: tile.x + 32, y: tile.y, f: 0, g: 0, h: 0};
                    let p3 = {x: tile.x + 64, y: tile.y, f: 0, g: 0, h: 0};

                    let p4 = {x: tile.x, y: tile.y + 32, f: 0, g: 0, h: 0};
                    let p5 = {x: tile.x + 32, y: tile.y + 32, f: 0, g: 0, h: 0};
                    let p6 = {x: tile.x + 64, y: tile.y + 32, f: 0, g: 0, h: 0};

                    let p7 = {x: tile.x, y: tile.y +64, f: 0, g: 0, h: 0};
                    let p8 = {x: tile.x + 32, y: tile.y +64, f: 0, g: 0, h: 0};
                    let p9 = {x: tile.x + 64, y: tile.y +64, f: 0, g: 0, h: 0};

                    this.pathMesh.push(p1);
                    this.pathMesh.push(p2);
                    this.pathMesh.push(p3);
                    this.pathMesh.push(p4);
                    this.pathMesh.push(p5);
                    this.pathMesh.push(p6);
                    this.pathMesh.push(p7);
                    this.pathMesh.push(p8);
                    this.pathMesh.push(p9);
                }
            }
        }

        // remove duplicats
        this.pathMesh = this.pathMesh.filter(function(item, pos, self) {
            for(let i = 0; i <= pos; i++) {
                if(self[i].x === item.x && self[i].y === item.y) {
                    if(pos === i) return item;
                    break;
                }
            }
        });

        // find max x and max y points of the mesh
        let maxX = 0, maxY = 0;
        for(let i = 0; i < this.pathMesh.length; i++) {
            if(this.pathMesh[i].x > maxX) {
                maxX = this.pathMesh[i].x;
            }
            if(this.pathMesh[i].y > maxY) {
                maxY = this.pathMesh[i].y;
            }
        }
        // sort points
        let pathMeshRefind = [];
        for(let y = this.pathMesh[0].y; y <= maxY; y += 32) {
            pathMeshRefind.push([]);
            for(let x = this.pathMesh[0].x; x <= maxX; x += 32) {
                for(let i = 0; i < this.pathMesh.length; i++) {
                    if(this.pathMesh[i].x === x && this.pathMesh[i].y === y){
                        pathMeshRefind[pathMeshRefind.length-1].push(this.pathMesh[i]);
                        break;
                    }
                }
            }
        }
        this.pathMesh = new PathMesh(pathMeshRefind);
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