
class BotPlayer extends Player{

    get name(){
        return "BotPlayer"
    }

    mx=0
    my=0

    constructor(id,x,y){
        super(id,x,y)
        // app.stage.click=(data)=>{
        //     this.mx=data.data.global.x
        //     this.my=data.data.global.y
        // }
        g.mousemove=(data)=>{
            console.log(data)
            this.mx=data.data.global.x
            this.my=data.data.global.y
        }
        g.mousedown=(data)=>{
            this.do_split=true
        }

    }

    do_split=false

    next_action(game) {
        let s=this.do_split
        if(s)this.do_split=false
        return new Action(this.mx,this.my,s)
    }


}