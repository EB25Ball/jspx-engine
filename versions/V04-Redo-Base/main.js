function dot(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}


function addObject(x=Math.floor(Math.random() * (window.innerWidth - 200))+100, y=Math.floor(Math.random() * (window.innerHeight - 200))+100, v=[2 - Math.floor(Math.random() * 4), 2 - Math.floor(Math.random() * 4)], m=Math.floor(Math.random() * 1000)) {
    var obj = new RigidBody(world, 'circle', x, y, Math.floor(Math.random() * 20)+5, v, m);
}


function physics(render) {
    render.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // gravity
    RigidBody.allInstances.forEach(obj => {
        if (obj.pos[0] >= obj.rad) {
            if (obj.pos[0] <= window.innerWidth - obj.rad) {
                if (obj.pos[1] >= obj.rad) {
                    if (obj.pos[1] <= window.innerHeight - obj.rad) {
                        // do things
                        obj.velocity[1] += render.gravity;
                    } else {
                        obj.pos[1] = window.innerHeight - obj.rad;
                        obj.velocity[1] *= (-.6 * (1 - 10/obj.mass));
                    }
                } else {
                    obj.pos[1] = obj.rad;
                    obj.velocity[1] *= (-.6 * (1 - 10/obj.mass));
                }
            } else {
                obj.pos[0] = window.innerWidth - obj.rad;
                obj.velocity[0] *= (-.6 * (1 - 10/obj.mass));
            }
        } else {
            obj.pos[0] = obj.rad;
            obj.velocity[0] *= (-.6 * (1 - 10/obj.mass));
        }
    });
    //move
    var moving = [];
    RigidBody.allInstances.forEach(obj => {
        RigidBody.allInstances.forEach( col => {
            var hypot = Math.hypot((obj.pos[0] + obj.velocity[0]) - col.pos[0], (obj.pos[1] + obj.velocity[1]) - col.pos[1]);
            if (hypot <= obj.rad + col.rad) {
                if (col != obj) {
                    //obj.velocity[0] *= -1;
                    //obj.velocity[1] *= -1;
                    fxcol = (((col.mass - obj.mass) / (col.mass + obj.mass)) * col.velocity[0]) + (((2 * obj.mass) / (col.mass + obj.mass)) * obj.velocity[0]);
                    fycol = (((col.mass - obj.mass) / (col.mass + obj.mass)) * col.velocity[1]) + (((2 * obj.mass) / (col.mass + obj.mass)) * obj.velocity[1]);
                    fxobj = (((2 * col.mass) / (col.mass + obj.mass)) * col.velocity[0]) - (((col.mass - obj.mass) / (col.mass + obj.mass)) * obj.velocity[0]);
                    fyobj = (((2 * col.mass) / (col.mass + obj.mass)) * col.velocity[1]) - (((col.mass - obj.mass) / (col.mass + obj.mass)) * obj.velocity[1]);
                    
                    if (obj.pos[0] > 500 && obj.pos[1] > 500) {
                        //bottom right
                        obj.pos[0] == col.pos[0] - col.rad - obj.rad;
                        obj.pos[1] == col.pos[1] - col.rad - obj.rad;
                        //col.pos[0] == obj.pos[0] - obj.rad - col.rad;
                        //col.pos[1] == obj.pos[1] - obj.rad - col.rad;
                    } else if (obj.pos[0] > 500 && obj.pos[1] <= 500) {
                        //top right
                        obj.pos[0] == col.pos[0] - col.rad - obj.rad;
                        obj.pos[1] == col.pos[1] + col.rad + obj.rad;
                        //col.pos[0] == obj.pos[0] - obj.rad - col.rad;
                        //col.pos[1] == obj.pos[1] + obj.rad + col.rad;
                    } else if (obj.pos[0] <= 500 && obj.pos[1] > 500) {
                        //bottom left
                        obj.pos[0] == col.pos[0] + col.rad + obj.rad;
                        obj.pos[1] == col.pos[1] - col.rad - obj.rad;
                        //col.pos[0] == obj.pos[0] + obj.rad + col.rad;
                        //col.pos[1] == obj.pos[1] - obj.rad - col.rad;
                    } else if (obj.pos[0] <= 500 && obj.pos[1] <= 500) {
                        //top left
                        obj.pos[0] == col.pos[0] + col.rad + obj.rad;
                        obj.pos[1] == col.pos[1] + col.rad + obj.rad;
                        //col.pos[0] == obj.pos[0] + obj.rad + col.rad;
                        //col.pos[1] == obj.pos[1] + obj.rad + col.rad;
                    }
                    //obj.pos[0] == col.pos[0] + col.rad;
                    //obj.pos[1] == col.pos[1] + col.rad;
                    //col.pos[0] == obj.pos[0] + obj.rad;
                    //col.pos[1] == obj.pos[1] + obj.rad;

                    col.velocity[0] = fxcol;
                    col.velocity[1] = fycol;
                    obj.velocity[0] = fxobj;
                    obj.velocity[1] = fyobj;
                }
            }
            else {
                if (!moving.includes(obj)) {
                    moving.push(obj);
                }
            }
        });
    });
    moving.forEach(obj => {
        obj.pos[0] += obj.velocity[0];
        obj.pos[1] += obj.velocity[1];
    });
    //mouse
    if (mouseDown != false && mouseEnabled == true) {
        RigidBody.allInstances.forEach( obj => {
            var vx = mouseDown[0] - obj.pos[0];
            var vy = mouseDown[1] - obj.pos[1];
            obj.velocity[0] += vx/3000;
            obj.velocity[1] += vy/3000;
        });
    }
    //collision check
    /*
    RigidBody.allInstances.forEach( obj => {
        RigidBody.allInstances.forEach( col => {
            var hypot = Math.hypot(col.pos[0] - obj.pos[0], col.pos[1] - obj.pos[1]);
            if (hypot <= obj.rad + col.rad) {
                col.mass = 1000;
            } else {
                col.mass = 400;   
            }
            var hypot = Math.hypot((obj.pos[0] + obj.velocity[0]) - col.pos[0], (obj.pos[1] + obj.velocity[1]) - col.pos[1]);
            if (hypot <= obj.rad + col.rad) {
                col.mass = 1000;
            } else {
                col.mass = 400;   
            }
        });
    });
    */
    //draw
    RigidBody.allInstances.forEach( obj => {
        if (obj.type == 'circle') {
            render.circle(render.ctx, obj.pos[0], obj.pos[1], obj.rad, obj.mass);
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
        var run = setInterval(() => {physics(this)}, .0010);
    }
    pause() {
        clearInterval(run);
    }
    circle(ctx, x, y, r, m) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(' + (255*(m/1000)) + ', 0, 0)';
        ctx.fillStyle = 'rgb(' + (255*(m/1000)) + ', 0, 0)';
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
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
c.width = window.innerWidth;
c.height = window.innerHeight;
var mouseDown;
var mouseEnabled;

c.addEventListener("click", function(e) { 
    var cX = Math.round(e.clientX/c.getBoundingClientRect().width * window.innerWidth);
    var cY = Math.round(e.clientY/c.getBoundingClientRect().height * window.innerHeight);
    mouseDown = [cX, cY];
    if (mouseEnabled != true) {
        for (i = 0; i < 20; i++) {
            addObject(mouseDown[0], mouseDown[1], [2 - Math.floor(Math.random() * 4), 2 - Math.floor(Math.random() * 4)], RigidBody.allInstances.length * 10);
        }
    }
    var can = document.getElementById("render");
    if (can.height != window.innerHeight && can.width != window.innerWidth) {
        can.width = window.innerWidth;
        can.height = window.innerHeight;
    }
    RigidBody.allInstances.forEach(obj => {
        if (obj.type == 'circle') {
            if (Math.hypot(cX - obj.pos[0], cY - obj.pos[1]) < obj.rad) {
                obj.mass = obj.mass+100;
                //obj.rad = obj.rad+5
            }
        }
    });
});
c.addEventListener("mouseup", function(e) { 
    mouseDown = false;
});

var ctx = c.getContext("2d");
const world = new Render(ctx, window.innerWidth, window.innerHeight, 0);

world.render();
/* */
var dissapear = setInterval(() => {
    if (RigidBody.allInstances.length < 120) {
        for (i = 0; i < 4; i++) {
            addObject();
        }
    }
    RigidBody.allInstances.forEach(obj => {
        obj.rad -= .008;
        if (obj.rad < .1) {
            obj.rad = 20;
            obj.pos = [window.innerWidth/2, window.innerHeight/2];
        }
    });
}, .0001);
/* */