
class Cell {
    x=0
    y=0
    rad=0

    constructor(x,y,rad){
        this.x=x
        this.y=y
        this.rad=rad
    }

    intersects(other){
        return utils.dist(this.x,this.y,other.x,other.y)
    }

}