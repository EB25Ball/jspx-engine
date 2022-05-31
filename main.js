function dot(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}


/*
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
*/
function physics(render) {
    render.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // gravity
    RigidBody.allInstances.forEach(obj => {
        obj.velocity[1] += render.gravity;
    });
    //move
    RigidBody.allInstances.forEach(obj => {
        obj.pos[0] += obj.velocity[0];
        obj.pos[1] += obj.velocity[1];
        if (obj.pos[1] > window.innerHeight - obj.rad) {
            obj.pos[1] = window.innerHeight - obj.rad;
            obj.velocity[0] = obj.velocity[0] * .9995;
            obj.velocity[1] = -obj.velocity[1] * 0.6 * (1 - 10/obj.mass);
        }
        if (obj.pos[0] > window.innerWidth - obj.rad) {
            obj.pos[0] = window.innerWidth - obj.rad;
            obj.velocity[0] = -obj.velocity[0] * 0.6 * (1 - 10/obj.mass);
        }
        if (obj.pos[0] < obj.rad) {
            obj.pos[0] = obj.rad;
            obj.velocity[0] = -obj.velocity[0] * 0.6 * (1 - 10/obj.mass);
        }
        if (obj.pos[1] < obj.rad) {
            obj.pos[1] = obj.rad;
            obj.velocity[1] = -obj.velocity[1] * 0.6 * (1 - 10/obj.mass);
        }
    });
    //mouse
    if (mouseDown != false && mouseEnabled == true) {
        RigidBody.allInstances.forEach( obj => {
            var vx = mouseDown[0] - obj.pos[0];
            var vy = mouseDown[1] - obj.pos[1];
            obj.velocity[0] += vx/2000;
            obj.velocity[1] += vy/2000;
        });
    }
    //collision
    RigidBody.allInstances.forEach( col => {
        RigidBody.allInstances.forEach( obj => {
            if (col.type == 'circle' && obj.type == 'circle') {
                var hypot = Math.hypot(col.pos[0] - obj.pos[0], col.pos[1] - obj.pos[1]);
                if (hypot < col.rad + obj.rad) {
                    if (col.pos[1] > obj.pos[1]) {
                        var vx = col.pos[0] - obj.pos[0];
                        var vy = col.pos[1] - obj.pos[1];
                        col.velocity[0] += vx/100;
                        col.velocity[1] += vy/200;
                        obj.velocity[0] += -vx/100;
                        obj.velocity[1] += -vy/100;
                    } else if (col.pos[1] < obj.pos[1]) {
                        var vx = obj.pos[0] - col.pos[0];
                        var vy = obj.pos[1] - col.pos[1];
                        obj.velocity[0] += vx/100;
                        obj.velocity[1] += vy/200;
                        col.velocity[0] += -vx/100;
                        col.velocity[1] += -vy/100;
                    } else {
                        var vx = col.pos[0] - obj.pos[0];
                        col.velocity[0] += vx/1000;
                        obj.velocity[0] += -vx/1000;
                    }
                }
            }
        });
    });
    //draw
    RigidBody.allInstances.forEach( obj => {
        if (obj.type == 'circle') {
            render.circle(render.ctx, obj.pos[0], obj.pos[1], obj.rad);
        } else if (obj.type == 'square') {
            render.rect(render.ctx, obj.pos[0], obj.pos[1], obj.width, obj.height);
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
    render() {
        var run = setInterval(() => {physics(this)}, .10);
    }
    freeze() {
        clearInterval(run);
    }
    circle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();//stroke/fill
        //for (var i = 0; i < 2 * Math.PI; i = i + Math.PI/6) {
        //    dot(ctx, x+r*Math.cos(i), y+r*Math.sin(i));
        //}
    }
    rect(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();
        dot(ctx, x, y);
        dot(ctx, x+w, y);
        dot(ctx, x, y+h);
        dot(ctx, x+w, y+h);
    }
}

class RigidBody {
    /*
    (world, square, x, y, rot, [vx, vy], mass, w, h)
    (world, circle, x, y, rad, [vx, vy], mass, NULL, NULL)
    (world, trigger:circle, x, y, rad, [vx, vy], 0, NULL, NULL)
    (world, trigger:square, x, y, rot, [vx, vy], 0, w, h)
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
//var setSize = setInterval(() => {
//    var can = document.getElementById("render");
c.width = window.innerWidth;
c.height = window.innerHeight;
//}, 1000);
var mouseDown;
var mouseEnabled = true;
var cRect = c.getBoundingClientRect();
c.addEventListener("click", function(e) { 
    var cX = Math.round(e.clientX/cRect.width * window.innerWidth);
    var cY = Math.round(e.clientY/cRect.height * window.innerHeight);
    mouseDown = [cX, cY];
    var can = document.getElementById("render");
    if (can.height != window.innerHeight && can.width != window.innerWidth) {
        can.width = window.innerWidth;
        can.height = window.innerHeight;
    }
});
c.addEventListener("mouseup", function(e) { 
    mouseDown = false;
});
var ctx = c.getContext("2d");
const world = new Render(ctx, window.innerWidth, window.innerheight, .98);

var circle1 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [2, -1], 200);
var circle2 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [1, -1], 5000);
var circle3 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [0, -1], 100);
var circle4 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [-1, -1], 50);
var circle5 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [-2, -1], 20);
var circle6 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [2, -1], 200);
var circle7 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+5, [1, -1], 5000);
var circle8 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [0, -1], 100);
var circle9 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [-1, -1], 50);
var circle10 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [-2, -1], 20);
var circle11 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [2, -1], 200);
var circle12 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [1, -1], 5000);
var circle13 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [0, -1], 100);
var circle14 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [-1, -1], 50);
var circle15 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [-2, -1], 20);
var circle16 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [2, -1], 200);
var circle17 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [1, -1], 5000);
var circle18 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [0, -1], 100);
var circle19 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [-1, -1], 50);
var circle20 = new RigidBody(world, 'circle', Math.floor(Math.random() * (window.innerWidth - 200))+100, Math.floor(Math.random() * (window.innerHeight - 200))+100, Math.floor(Math.random() * 20)+20, [-2, -1], 20);

world.render();
