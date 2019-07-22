
let utils = {

    dist: (x0,y0,x1,y1)=>Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1)),
    lerp: (a,b,t)=>a+(b-a)*t,
    norm: (a,b,t)=>(b-t)/(b-a),
    map: (t,s0,e0,s1,e1)=>utils.lerp(s1,e1,utils.norm(s0,e0,t))

}