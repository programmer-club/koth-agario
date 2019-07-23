
class BotMackycheese0 extends Player{

    get name(){
        return "BotMackycheese0"
    }

    constructor(id,x,y){
        super(id,x,y)
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
        if (!closest_pellet) return new Action(1000, 0, false);
        return new Action(closest_pellet.x, closest_pellet.y, this.largest_cell().mass>200)
        // }else{
        //     return new Action(this.center_x_mass(),this.center_y_mass(),false)
        // }
    }

}