class PathMesh {
    constructor(mesh) {
        this.mesh = mesh;
    }

    getSpot(x, y) {

        let X = Math.floor(x / 32) * 32;
        let Y = Math.floor(y / 32) * 32;
        for(let i = 0; i < this.mesh.length; i++) {
            let el = this.mesh[i].find((elem) => {
                if(elem.x === X && elem.y === Y) {
                    return true;
                }
            });
            if(el) {
                return el;
            }
        }
        return null;
    }

    getNeighbors(x, y) {
        let  center = this.getSpot(x, y);
        let neighbors = [];
        for(let yy = center.y - 32;  yy  <= center.y + 64; yy += 32) {
            for(let xx = center.x  - 32; xx <= center.x + 64; xx += 32) {
                if(this.getSpot(xx, yy)  && (xx !== center.x && yy !== center.y)) {
                    neighbors.push(this.getSpot(xx, yy));
                }
            }
        }
        return neighbors;
    }
}

export default PathMesh;