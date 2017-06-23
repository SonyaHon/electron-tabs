import GameObject from './GameObject';

class Unit extends GameObject {
    constructor(texture, eventEmmiter, map, props) {
        super(texture, eventEmmiter, map);
        if(props) {
            this.maxHp = props['maxHp'] || 1;
            this.currentHp = this.maxHp;

            this.speed = props['speed'] || 0.001;

            this.x = props['x'] || 0;
            this.y = props['y'] || 0;
        }
        else {
            this.maxHp = 100;
            this.currentHp = this.maxHp;

            this.speed = 0.01;
            this.x = 0;
            this.y = 0;
        }

        this.team = null;
    }

    getNeighboorTiles(X, Y) {
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

    update() {
        this.updateCoords();
    }

    //Finds the closest enemy unit and set it as target
    findTarget() {
        //TODO decide with neutral team
        // get enemy team
        let enemyTeam = null;
        if(this.team === 'one') {
            enemyTeam = this.map.teamTwo.units;
        }
        else if (this.team === 'two') {
            enemyTeam = this.map.teamOne.units;
        }

        function countDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.abs(x2-x1)*Math.abs(x2-x1) + Math.abs(y2-y1)*Math.abs(y2-y1));
        }

        let minDist = countDistance(this.x, this.y, enemyTeam[0].x, enemyTeam[0].y);
        let possibleTargets = [];
        for(let key in enemyTeam) {
            let dist = countDistance(this.x, this.y, enemyTeam[key].x, enemyTeam[key].y);
            if(minDist > dist) {
                minDist = dist;
                possibleTargets = [];
                possibleTargets.push(enemyTeam[key]);
            }
            else if(minDist === dist) {
                if(possibleTargets.indexOf(enemyTeam[key]) === -1)
                    possibleTargets.push(enemyTeam[key]);
            }
        }
        this.target = {};
        this.target.unit = possibleTargets[Math.floor(Math.random() * (possibleTargets.length - 1))];
        this.target.unitDist = minDist;
    }

    setTeam(team) {
        this.team = team;
    }

}

export default Unit;