function dot(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}

function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.stroke();
    for (i = 0; i < 2 * Math.PI; i = i + Math.PI/6) {
        dot(ctx, x+r*Math.cos(i), y+r*Math.sin(i));
    }
}

function rect(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
    dot(ctx, x, y);
    dot(ctx, x+w, y);
    dot(ctx, x, y+h);
    dot(ctx, x+w, y+h);
}

function calcPhysics(ctx, g) {
    ctx.clearRect(0, 0, 1000, 1000);
    RigidBody.allInstances.forEach(obj => {
        obj.pos = [obj.pos[0], obj.pos[1]+obj.velocity[1]];
        obj.velocity[1] += g;
    });
    RigidBody.allInstances.forEach( collider => {
        RigidBody.allInstances.forEach( obj => {
            if (collider != obj) {
                if (collider.type == 'circle' && obj.type == 'circle') {
                    if (Math.hypot(collider.pos[0] - obj.pos[0], collider.pos[1] - obj.pos[1]) < collider.rad + obj.rad){
                        collider.pos = [(Math.random() * 800)+100, (Math.random() * 200)+100];
                        obj.pos = [(Math.random() * 800)+100, (Math.random() * 200)+100];
                        console.log('circle');
                    }
                } else if (collider.type == 'circle' && obj.type == 'square') {
                    //
                } else if (collider.type == 'square' && obj.type == 'square') {
                    var points = [
                        [collider.pos[0], collider.pos[1]], 
                        [collider.pos[0]+collider.width, collider.pos[1]+collider.width], 
                        [collider.pos[0]+collider.width+collider.height, collider.pos[1]+collider.width+collider.height], 
                        [collider.pos[0]+collider.height, collider.pos[1]+collider.height]
                    ];
                    for (i = 0; i < points.length; i++) {
                        if (points[i][0] > obj.pos[0] && points[i][0] < obj.pos[0]+obj.width && points[i][1] > obj.pos[1] && points[i][1] < obj.pos[1]+obj.height) {
                            collider.pos = [(Math.random() * 800)+100, (Math.random() * 200)+100];
                            obj.pos = [(Math.random() * 800)+100, (Math.random() * 200)+100];
                            console.log('square');
                        }
                    }
                } else if (collider.type == 'square' && obj.type == 'circle') {
                    var points = [
                        [collider.pos[0], collider.pos[1]], 
                        [collider.pos[0]+collider.width, collider.pos[1]+collider.width], 
                        [collider.pos[0]+collider.width+collider.height, collider.pos[1]+collider.width+collider.height], 
                        [collider.pos[0]+collider.height, collider.pos[1]+collider.height]
                    ];
                    for (i = 0; i < points.length; i++) {
                        if (Math.hypot(points[i][0] - obj.pos[0], points[i][1] - obj.pos[1]) < obj.rad) {
                            collider.pos = [(Math.random() * 800)+100, (Math.random() * 200)+100];
                            obj.pos = [(Math.random() * 800)+100, (Math.random() * 200)+100];
                            console.log('both');
                        }
                    }
                }
            }
        });
    });
    RigidBody.allInstances.forEach( obj => {
        if (obj.type == 'circle') {
            if (obj.pos[0] < obj.rad || obj.pos[1] < obj.rad || obj.pos[0] > 1000-obj.rad || obj.pos[1] > 1000-obj.rad) {
                obj.pos = [(Math.random() * 900)+100, 500];//[obj.pos[0], obj.pos[1] - obj.velocity[1]];
                obj.velocity[1] = 0;
            }
            circle(ctx, obj.pos[0], obj.pos[1], obj.rad);
        } else if (obj.type == 'square') {
            if (obj.pos[0] < 0 || obj.pos[1] < 0 || obj.pos[0] > 1000-obj.width || obj.pos[1] > 1000-obj.height) {
                obj.pos = [(Math.random() * 900)+100, 500];//[obj.pos[0], obj.pos[1] - obj.velocity[1]];
                obj.velocity[1] = 0;
            }
            rect(ctx, obj.pos[0], obj.pos[1], obj.width, obj.height);
        }
    });
}

class Render {
    constructor(ctx, width, height, gravity) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.gravity = gravity/100;
    }
    set() {
        var run = setInterval(() => {calcPhysics(this.ctx, this.gravity)}, .10);
    }
    freeze() {
        clearInterval(run);
    }
}

class RigidBody {
    // r is rad or rot
    /*
    (world, square, x, y, rot, [rot, speed], mass, w, h)
    (world, circle, x, y, rad, [rot, speed], mass, NULL, NULL)
    (world, trigger:circle, x, y, rad, [rot, speed], 0, NULL, NULL)
    (world, trigger:square, x, y, rot, [rot, speed], 0, w, h)
    */
   constructor(render, type, x, y, r, v, mass, w, h){
       this.render = render;
       this.type = type;
       this.pos = [x, y];
       if (type == 'square') {
           this.rot = r;
        } else if (type == 'circle') {
            this.rad = r;
        }
        this.velocity = v;
        this.mass = mass;
        if (w) {
            this.width = w;
        }
        if (h) {
            this.height = h;
        }
        RigidBody.allInstances.push(this);
    }
}
RigidBody.allInstances = [];
var c = document.getElementById("render");
var ctx = c.getContext("2d");

dot(ctx, 10, 10);
circle(ctx, 60, 80, 30);
rect(ctx, 120, 200, 30, 40);
const world = new Render(ctx, 1000, 1000, .098);
var firstCircle = new RigidBody(world, 'circle', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30);
var firstRect = new RigidBody(world, 'square', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30, Math.floor(Math.random() * 70)+30, Math.floor(Math.random() * 70)+30);
var secondRect = new RigidBody(world, 'circle', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30);
var thirdRect = new RigidBody(world, 'square', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30, Math.floor(Math.random() * 70)+30, Math.floor(Math.random() * 70)+30);
//var fourthRect = new RigidBody(world, 'circle', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30);
//var thirdRect2 = new RigidBody(world, 'square', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30, Math.floor(Math.random() * 70)+30, Math.floor(Math.random() * 70)+30);
//var fourthRect2 = new RigidBody(world, 'circle', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30);
//var thirdRect3 = new RigidBody(world, 'square', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30, Math.floor(Math.random() * 70)+30, Math.floor(Math.random() * 70)+30);
//var fourthRect3 = new RigidBody(world, 'circle', Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 999)+1, Math.floor(Math.random() * 70)+25, [0, 0], 30);


world.set();
c.onclick = function(){world.set()};