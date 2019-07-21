
class Player {

    id = 0
    cells=[]

    constructor(id,x,y) {
        this.id = id
        this.cells = [new Cell(x, y, 0,30),new Cell(x+10,y,0,40),new Cell(x,y+5,0,100)]
    }

    is_dead(){
        return this.cells.length===0
    }

    next_action(game){
        return new Action(-1,-1)
    }

}