
class Player {

    id = 0;
    cells=[];
    hungry=undefined;
    fat=undefined

    constructor(id,x,y) {
        this.id = id;
        // this.cells = [new Cell(x, y, 0,30),new Cell(x+10,y,0,40),new Cell(x,y+5,0,100),new Cell(x-10,y-10,0,200)]
        this.cells=[new Cell(x,y,id,10)]
        this.hungry=Math.random()<0.5
        this.fat=Math.random()<0.5
    }

    total_mass(){
        let m=0
        for(let i=0;i<this.cells.length;i++){
            m+=this.cells[i].mass
        }
        return m
    }

    is_dead(){
        return this.cells.length===0
    }

    view_distance(){

    }

    center_x(weight){
        let sum=0;
        let div=0;
        for(let i=0;i<this.cells.length;i++){
            let w=weight(this.cells[i]);
            sum+=w*this.cells[i].x;
            div+=w
        }
        return sum/div
    }

    center_y(weight){
        let sum=0;
        let div=0;
        for(let i=0;i<this.cells.length;i++){
            let w=weight(this.cells[i]);
            sum+=w*this.cells[i].y;
            div+=w
        }
        return sum/div
    }

    center_x_avg(){
        return this.center_x(cell=>1)
    }

    center_y_avg(){
        return this.center_y(cell=>1)
    }

    center_x_mass(){
        return this.center_x(cell=>cell.mass)
    }

    center_y_mass(){
        return this.center_y(cell=>cell.mass)
    }

    center_x_rad(){
        return this.center_x(cell=>cell.rad)
    }

    center_y_rad(){
        return this.center_y(cell=>cell.rad)
    }

    largest_cell(){
        let cell=this.cells[0]
        for(let i=1;i<this.cells.length;i++){
            if(this.cells[i].mass>cell.mass)cell=this.cells[i]
        }
        return cell
    }

    for_each_cell(f){
        for(let i=0;i<this.cells.length;i++){
            f(i)
        }
    }

    next_action(game){
        if(this.is_dead())return undefined
        // if(this.hungry) {
            let closest_pellet = undefined;
            for (let i = 0; i < game.pellets.length; i++) {
                if (!closest_pellet) {
                    closest_pellet = game.pellets[i]
                } else {
                    if (utils.dist(this.center_x_mass(), this.center_y_mass(), game.pellets[i].x, game.pellets[i].y) < utils.dist(this.center_x_mass(), this.center_y_mass(), closest_pellet.x, closest_pellet.y)
                    &&utils.dist(this.center_x_mass(),this.center_y_mass(),game.pellets[i].x,game.pellets[i].y)>20) {
                        let good_pellet=true
                        this.for_each_cell(index=>{
                            if(utils.dist(this.cells[index].x,this.cells[index].y,game.pellets[i].x,game.pellets[i].y)<this.cells[index].rad)good_pellet=false
                        })
                        if(good_pellet)closest_pellet = game.pellets[i]
                    }
                }
            }
            if (!closest_pellet) return new Action(1000, 0, false);
            return new Action(closest_pellet.x, closest_pellet.y, this.id===0?true:(this.largest_cell().mass>(this.fat?400:50)))
        // }else{
        //     return new Action(this.center_x_mass(),this.center_y_mass(),false)
        // }
    }

}