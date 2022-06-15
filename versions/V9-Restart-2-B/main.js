var c = document.getElementById("render");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

function addObject(x=Math.floor(Math.random() * (window.innerWidth - 200))+100, y=Math.floor(Math.random() * (window.innerHeight - 200))+100, v=[2 - Math.random() * 4, 2 - Math.random() * 4], m=Math.floor(Math.random() * 1000)) {
    var obj = new Circle([x, y], Math.floor(Math.random() * 20)+5, v, m);
}

// physics
function physics(render) {
    render.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // gravity
    Circle.allInstances.forEach(obj => {
        obj.vel[1] += render.gravity;
    });

    // move
    Circle.allInstances.forEach(obj => {
        obj.pos[1] += obj.vel[1];
        obj.pos[0] += obj.vel[0];
    });

    // collisions between objects
    Circle.allInstances.forEach(obj => {
        Circle.allInstances.forEach(obj2 => {
            if (obj != obj2) {
                dist = Math.hypot(obj.pos[0] - obj2.pos[0], obj.pos[1] - obj2.pos[1]);
                if (dist <= obj.rad + obj2.rad) {
                    obj.mass = 1000;

                    /*
                    var angle = Math.atan2(obj.pos[1] - obj2.pos[1], obj.pos[0] - obj2.pos[0]);
                    
                    obj.pos[0] += obj.rad * Math.cos(angle);
                    obj.pos[1] += obj.rad * Math.sin(angle);
                    obj2.pos[0] += obj2.rad * Math.cos(angle);
                    obj2.pos[1] += obj2.rad * Math.sin(angle);
                    
                    var angle = Math.atan2(obj.pos[1] - obj2.pos[1], obj.pos[0] - obj2.pos[0]);
                    
                    var vel1 = Math.sqrt(Math.pow(obj.vel[0], 2) + Math.pow(obj.vel[1], 2));
                    var vel2 = Math.sqrt(Math.pow(obj2.vel[0], 2) + Math.pow(obj2.vel[1], 2));
                    
                    obj.vel[0] = vel1 * Math.cos(angle);
                    obj.vel[1] = vel1 * Math.sin(angle);
                    obj2.vel[0] = vel2 * Math.cos(angle);
                    obj2.vel[1] = vel2 * Math.sin(angle);
                    */
                }
            }
        });
    });

    // walls
    Circle.allInstances.forEach(obj => {
        // while not all do :
        while (obj.pos[0] < obj.rad || obj.pos[0] > window.innerWidth - obj.rad || obj.pos[1] < obj.rad || obj.pos[1] > window.innerHeight - obj.rad) {
            if (obj.pos[0] <= obj.rad) {
                //left
                var m;
                obj.vel[1] == 0 
                    ? m = 0
                    : m = obj.vel[0] / obj.vel[1];
                var y = obj.pos[1] + m * (obj.rad - obj.pos[0]);
                obj.vel[0] *= -.6;
                obj.pos[0] = obj.rad;
                obj.pos[1] = y;
            } else if (obj.pos[0] >= window.innerWidth - obj.rad) {
                //right

                /*
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                var a = obj.pos[0];
                var b = obj.pos[1];
                var w = window.innerWidth;
                var r = obj.rad;
                var n = 4
                //var y=-m*x+(b-m*a)+n*m(m(w-r)+(b-m*a));
                var y = obj.pos[1];
                obj.pos[0] = (-y/m) + (b/m)-a+n*m*w-n*m*r+n*b-n*m*a;
                obj.pos[1] = y;
                obj.vel[1] *= -1;
                */




                /*
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                var rPos = [];
                rPos[0] = window.innerWidth - obj.rad;
                rPos[1] = m(window.innerWidth - obj.rad) + (obj.pos[1] - m(obj.pos[0]));
                var nPos = [];
                nPos[0] = obj.pos[1] - obj.pos[0] - obj.pos[1];
                nPos[1] = obj.pos[1];
                var b = obj.pos[1];
                var a = obj.pos[0];
                var newPos = [nPos[0], -m*x+(b-m*a)+4*m(m(980)+(b-m*a))]
                obj.pos = newPos;
                obj.vel[0] *= -1;
                // y = m(x) + (pos[1] - m(pos[0]));
                // flip = -m(x) + (pos[1] - m(pos[0]));
                /* */
            } else if (obj.pos[1] <= obj.rad) {
                //top
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                var x = obj.pos[0] + m * (obj.rad - obj.pos[1]);
                obj.vel[1] *= -.6;
                obj.pos[1] = obj.rad;
                obj.pos[0] = x;
            } else if (obj.pos[1] >= window.innerHeight - obj.rad) {
                //bottom
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                var x = obj.pos[0] + m * (window.innerHeight - obj.rad - obj.pos[1]);
                obj.vel[1] *= -.6;
                obj.pos[1] = window.innerHeight - obj.rad;
                obj.pos[0] = x;
            }
        }
    });
    // draw
    Circle.allInstances.forEach(obj => {
        render.circle(render.ctx, obj.pos[0], obj.pos[1], obj.rad, obj.mass);
    });
}


// classes

class Circle {
    constructor([x, y], rad, [vx, vy]) {
        this.pos = [x, y];
        this.rad = rad;
        this.vel = [vx, vy];
        this.mass = rad;
        Circle.allInstances.push(this);
    }
}

class Render {
    constructor(ctx, w, h, g) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;
        this.gravity = g/100;
    }
    render() {
        clearInterval(this.run);
        this.run = setInterval(() => {physics(this)}, 1/60);
    }
    pause() {
        clearInterval(this.run);
    }
    step() {
        physics(this);
    }
    circle(ctx, x, y, r, m) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(' + (255*(m/1000)) + ', 0, 0)';
        ctx.fillStyle = 'rgb(' + (255*(m/1000)) + ', 0, 0)';
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

// run

c.addEventListener("click", function(e) { 
    var cX = Math.round(e.clientX/c.getBoundingClientRect().width * window.innerWidth);
    var cY = Math.round(e.clientY/c.getBoundingClientRect().height * window.innerHeight);
    mouseCoords = [cX, cY];
    addObject(mouseCoords[0], mouseCoords[1], /**/[1, 1]/*[2 - Math.floor(Math.random() * 4), 2 - Math.floor(Math.random() * 4)]/**/, (Circle.allInstances.length + 1) * 10);
});

const world = new Render(ctx, window.innerWidth, window.innerHeight, 9.8);

Circle.allInstances = [];
world.render();