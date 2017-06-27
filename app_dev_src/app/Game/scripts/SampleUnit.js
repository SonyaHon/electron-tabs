import Unit from './Unit.js';
import AStar from './A*.js';

class SampleUnit extends Unit {
    constructor(texture, eventEmitter, map, props) {
        super(texture, eventEmitter, map, props);

        this.attackRadius = 1;

        if(this.props) {
            this.attackRadius = props['attackRadius'] || 1;
        }

        let self = this;

        this.selfEventEmitter.on('attacked', function (dmg) {
            self.decreaseHp(dmg);
        });

        this.paths = new AStar(this.map.pathMesh);
    }

    update(){
        super.update();
        this.findTarget();

        if(this.target.unitDist <= (this.attackRadius * 64)) {
            this.attack(this.target.unit);
        }
        else {
            this.moveTo(this.target.unit);
        }
    }

    attack(target) {
        let dmg = this.dmg;
        target.selfEventEmitter.emit('attacked', dmg);
    }

    moveTo(target) {
        /*
        let vec = {x: target.x - this.x, y: target.y - this.y};
        this.translate(vec);
        */
        this.paths.findPath(this.x, this.y, target.x, target.y);
    }
}

export default SampleUnit;