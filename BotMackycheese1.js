
class BotMackycheese1 extends Player{

    get name(){
        return "BotMackycheese1"
    }

    constructor(id,x,y){
        super(id,x,y)
    }

    average_cell_mass(game){
        let total=0
        let div=0
        game.foreach_cell((player_id,cell_id,cell)=>{
            if(player_id===this.id)return
            total+=cell.mass
            div+=1
        })
        if(div===0)return 0
        return total/div
    }

    get_vector_for_cell(x,y,rad,mass){
        const HUNGRINESS=0.01
        const FEAR=0.01
        let vec={x:0,y:0}
        this.for_each_cell(cell_index=>{
            let cell=this.cells[cell_index]
            if(utils.dist(cell.x,cell.y,x,y)>400)return
            let dx=x-cell.x
            let dy=y-cell.y
            if(rad<cell.rad*0.75){
                vec.x+=dx*HUNGRINESS*mass
                vec.y+=dy*HUNGRINESS*mass
            }else if(cell.rad>0.75*rad){
                vec.x-=dx*FEAR*mass
                vec.y-=dy*FEAR*mass
            }
        })
        return vec
    }

    next_action(game){
        if(this.is_dead())return undefined

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
        let do_split=false
        let split_target=undefined
        let new_split_mass=undefined
        for(let i=0;i<this.cells.length;i++){
            game.foreach_cell((p,c,cell)=>{
                if(p===this.id)return
                let my_cell=this.cells[i]
                if(utils.dist(my_cell.x,my_cell.y,cell.x,cell.y)<my_cell.rad*2.0&&my_cell.rad>1.5*cell.rad){
                    do_split=true
                    split_target={x:cell.x,y:cell.y}
                    new_split_mass=my_cell.mass/2+cell.mass/2
                }
            })
        }
        if(do_split){
            if(this.average_cell_mass(game)>new_split_mass)do_split=false
            if(this.cells.length>3)do_split=false
        }
        // if(this.total_mass()/this.cells.length>2*this.average_cell_mass(game)){
        //     do_split=true
        //     split_target={
        //         x:closest_pellet.x,
        //         y:closest_pellet.y
        //     }
        // }

        if (!closest_pellet) return new Action(1000, 0, do_split);
        else return new Action(do_split?split_target.x:closest_pellet.x,do_split?split_target.y:closest_pellet.y,do_split)
    }

}