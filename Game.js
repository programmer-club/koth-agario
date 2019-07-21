
class Game{

    players = []

    width = 1000
    height = 1000

    colors=[
        0xFF5544,
        0x4455FF
    ]

    constructor(){
    }

    setup(){
        this.players.push(new Player(0, 500, 500))
    }

    update_player(index){
        for(let i=0;i<5;i++) {
            const SLOWDOWN = 0.9

            let action = this.players[index].next_action(this)
            let cells = this.players[index].cells
            for (let i = 0; i < cells.length; i++) {
                cells[i].vel_x *= SLOWDOWN
                cells[i].vel_y *= SLOWDOWN
                for (let j = 0; j < cells.length; j++) {
                    if (i === j) continue
                    if (cells[i].intersects(cells[j])) {
                        Game.seperate(cells[i], cells[j])
                    } else {
                        // Game.go_closer(cells[i],cells[j])
                    }
                }
                let MOVE_FACTOR = 1 / cells[i].rad
                cells[i].x += cells[i].vel_x
                cells[i].y += cells[i].vel_y
                cells[i].vel_x += action.move_x * MOVE_FACTOR
                cells[i].vel_y += action.move_y * MOVE_FACTOR
                Game.bounds_check(cells[i], 0.1, 10)
            }
        }
    }

    static bounds_check(cell,AMOUNT,iters){
        AMOUNT/=iters
        for(let i=0;i<iters;i++){
            let dx=0
            let dy=0
            if(cell.x<cell.rad)dx=(cell.rad-cell.x)*AMOUNT
            if(cell.y<cell.rad)dy=(cell.rad-cell.y)*AMOUNT
            if(cell.x>=Game.width-cell.rad)dx=(cell.x-Game.width-cell.rad)*AMOUNT
            if(cell.y>=Game.height-cell.rad)dy=(cell.y-Game.height-cell.rad)*AMOUNT
            cell.vel_x+=dx
            cell.vel_y+=dy
        }
    }

    static operate(cell0,cell1,AMOUNT,iters){
        AMOUNT/=iters
        for(let i=0;i<iters;i++) {
            let dx = cell0.x - cell1.x
            let dy = cell0.y - cell1.y
            // AMOUNT*=Math.sqrt(dx*dx+dy*dy)
            dx *= AMOUNT
            dy *= AMOUNT
            cell0.vel_x += dx
            cell0.vel_y += dy
            cell1.vel_x -= dx
            cell1.vel_y -= dy
        }
    }

    static seperate(cell0,cell1){
        Game.operate(cell0,cell1,0.0005,10)
    }

    // static go_closer(cell0,cell1){
    //     Game.operate(cell0,cell1,-0.01,10)
    // }

    frame(){

        for(let i=0;i<this.players.length;i++){
            this.update_player(i)
        }

    }

}