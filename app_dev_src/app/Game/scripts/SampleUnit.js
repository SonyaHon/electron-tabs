import Unit from './Unit.js';

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
            console.log('It herts! My health is', self.currentHp + '/' + self.maxHp);
        })
    }

    update(){
        super.update();
        this.findTarget();
        console.log(this.target.unitDist);

        if(this.target.unitDist <= (this.attackRadius * 64)) {
            this.attack(this.target.unit);
        }
        else {
            this.moveTo(this.target.unit);
        }
    }

    attack(target) {
        let dmg = this.dmg;
        target.selfEventEmitter.emit('attacked', );
    }

    moveTo(target) {
        let vec = {x: target.x - this.x, y: target.y - this.y};
        this.translate(vec);
    }
}

export default SampleUnit;