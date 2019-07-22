
class Graph {

    app = undefined
    colors = []
    g=undefined
    total_data=[]
    width=750
    height=500
    name=""
    txt=undefined

    min_value=1000000
    max_value=-1000000

    render_min=0
    render_max=0

    frame_retention=0
    frame_skip=0

    constructor(name,retention,skip,colors){
        this.name=name
        this.frame_retention=retention
        this.frame_skip=skip
        this.colors=colors
        this.app=new PIXI.Application({
            width:this.width,
            height:this.height,
            antialias:true,
            transparent:false,
            resolution:0.5,
            backgroundColor:0x000000
        })
        this.render_min=0
        this.render_max=0
        this.app.stage.interactive=true
        document.body.appendChild(this.app.view)
        this.g=new PIXI.Graphics()
        this.app.stage.addChild(this.g)
        this.txt=new PIXI.Text(this.name,{font:"arial",fill:"#FFFFFF",align:"left",stroke:"#FFFFFF",strokeThickness:0,fontSize:20})
        this.txt.anchor.set(0.0)
        this.app.stage.addChild(this.txt)
        this.app.ticker.add(()=>{
            this.txt.position.x=0
            this.txt.position.y=0

            this.g.clear()
            for(let i=0;i<this.colors.length;i++){
                this.draw_graph(i)
            }
            let FACTOR=0.1
            this.render_min=utils.lerp(this.render_min,this.min_value,FACTOR)
            this.render_max=utils.lerp(this.render_max,this.max_value,FACTOR)
        })
    }

    del_frame=0

    newFrame(data){
        if(this.del_frame<this.frame_skip){
            this.del_frame++
            return
        }
        this.del_frame=0
        if(this.total_data.length>this.frame_retention){
            this.total_data.splice(0,1)
            // this.del_frame++
            // this.del_frame%=this.frame_skip
        }
        let assembled_data=new Array(this.colors.length)
        for(let i=0;i<this.colors.length;i++){
            assembled_data[i]=0
        }
        for(let i=0;i<data.length;i++){
            assembled_data[data[i].id]=data[i].value
            this.min_value=Math.min(this.min_value,data[i].value)
            this.max_value=Math.max(this.max_value,data[i].value)
        }
        this.total_data.push(assembled_data)
    }

    draw_graph(index){
        this.g.lineStyle(5,this.colors[index])
        this.g.moveTo(0,0)
        let last_value=0
        for(let i=0;i<this.total_data.length;i++){
            let value=this.height-utils.map(this.total_data[i][index],this.render_min-10,this.render_max+10,this.height,0)
            let x_coord=this.width*i/this.total_data.length
            this.g.moveTo(x_coord-this.width/this.total_data.length,last_value).lineTo(x_coord,value)
            last_value=value
        }
    }

}