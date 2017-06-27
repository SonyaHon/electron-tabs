import PathMesh from './PathMesh.js';

class AStar {
    constructor(pathMesh) {
        this.pathMesh = pathMesh;
        this.openSet = [];
        this.closedSet = [];
        this.savedPath = null;
    }

    findPath(startPoint, endPoint) {
        this.openSet = [];
        this.closedSet = [];
        let pMesh = new PathMesh(Object.assign([], this.pathMesh.mesh));
        this.openSet.push(pMesh.getSpot(startPoint.x, startPoint.y));
        this.openSet[0].prevNode = undefined;
        while(this.openSet.length > 0) {
            let minFIdx = 0;
            for(let i = 0; i < this.openSet.length; i++) {
                if(minFIdx > this.openSet[i].g) {
                    minFIdx = i;
                }
            }

            let current = this.openSet[minFIdx];

            if(current.x === endPoint.x && current.y === endPoint.y) {
                return this.tracePath(current);
            }

            AStar.removeFromArr(this.openSet, current);
            this.closedSet.push(current);

            let neighbors = pMesh.getNeighbors(current.x, current.y);

            for(let i = 0; i < neighbors.length; i++) {
                let neighbour = neighbors[i];

                if(this.closedSet.includes(neighbour)) {
                    continue;
                }

                if(!this.openSet.includes(neighbour)) {
                    this.openSet.push(neighbour);
                }

                let tempG = current.g += 1;
                if(tempG >= neighbour.g) {
                    continue;
                }

                neighbour.prevNode = current;
                neighbour.g = tempG;
                neighbour.h = AStar.heuristic(neighbour, current);
                neighbour.f = neighbour.g + neighbour.h;
            }

        }

        this.savedPath = null;
        return null;
    }

    tracePath(lastSpot) {
        debugger;
        let temp = lastSpot;
        let path = [];
        path.push(temp);

        return path;
    }

    static removeFromArr(arr, spot)  {
        for(let i = arr.length - 1; i >= 0; i--) {
            if(spot === arr[i]) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    static heuristic(spot1, spot2) {
        return Math.sqrt(Math.abs(spot1.x-spot2.x)*Math.abs(spot1.x-spot2.x) + Math.abs(spot1.y-spot2.y)*Math.abs(spot1.y-spot2.y));
    }

}

export default AStar;