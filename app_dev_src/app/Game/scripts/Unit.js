import GameObject from './GameObject';

class Unit extends GameObject {
    constructor(texture, eventEmmiter, map, props) {
        super(texture, eventEmmiter, map);

        this.map = map;

        if(props) {
            this.maxHp = props['maxHp'] || 1;
            this.currentHp = this.maxHp;

            this.speed = props['speed'] || 1;

            this.x = props['x'] || 0;
            this.y = props['y'] || 0;
        }
        else {
            this.maxHp = 1;
            this.currentHp = this.maxHp;

            this.speed = 1;
            this.x = 0;
            this.y = 0;
        }
    }

    getNeighboors(X, Y) {
        let neighboors = [];
        X -= this.map.offset.x;
        Y -= this.map.offset.y;
        for(let x = -64; x <= 64; x += 64) {
            for(let y = -64; y <= 64; y += 64) {
                if((x !== 0 || y !== 0) && this.map.getTileAtCoords(X + x, Y + y) !== null) {
                    neighboors.push(this.map.getTileAtCoords(X + x, Y + y));
                }
            }
        }
        return neighboors;
    }
    // TODO Change it to moveToPoint() with A* or directly (for flying units?)
    translate(vector) {
        this.x += vector.x * this.speed;
        this.y += vector.y * this.speed;
    }

    decreaseHp(amount) {
        this.currentHp -= amount;
    }

    increaseHp(amount) {
        this.currentHp += amount;
    }

    setMaxHp(hp) {
        this.maxHp = hp;
    }

    getHp() {
        return this.currentHp;
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(val) {
        this.speed = val;
    }
}

export default Unit;