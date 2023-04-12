var c = document.getElementById("render");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

function addObject(x=Math.floor(Math.random() * (window.innerWidth - 200))+100, y=Math.floor(Math.random() * (window.innerHeight - 200))+100, v=[2 - Math.random() * 4, 2 - Math.random() * 4], m=(Math.floor(Math.random()+1) * 1000)) {
    var obj = new Circle([x, y], 15, v, m+1);
}

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
async function demo() {
    await sleep(100);
}
function poof() {
    Circle.allInstances.forEach( obj => {
        Circle.allInstances.forEach( col => {
            var hypot = Math.hypot(col.pos[0] - obj.pos[0], col.pos[1] - obj.pos[1]);
            if (col.pos[1] > obj.pos[1]) {
                var vx = col.pos[0] - obj.pos[0];
                var vy = col.pos[1] - obj.pos[1];
                col.vel[0] += vx/1000;
                col.vel[1] += vy/200000;
                obj.vel[0] += -vx/1000;
                obj.vel[1] += -vy/1000;
            } else if (col.pos[1] < obj.pos[1]) {
                var vx = obj.pos[0] - col.pos[0];
                var vy = obj.pos[1] - col.pos[1];
                obj.vel[0] += vx/1000;
                obj.vel[1] += vy/200000;
                col.vel[0] += -vx/1000;
                col.vel[1] += -vy/1000;
            } else {
                var vx = col.pos[0] - obj.pos[0];
                col.vel[0] += vx/10000;
                obj.vel[0] += -vx/10000;
            }
        });
    });
}

// physics
function physics(render) {
    render.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  
    // gravity
    Circle.allInstances.forEach(obj => {
      obj.vel[1] += render.gravity;
    });
  

        // Move all circles and handle wall collisions
        Circle.allInstances.forEach(circle => {
          // Move the circle
          circle.pos[0] += circle.vel[0];
          circle.pos[1] += circle.vel[1];
      
          // Handle collisions with left and right walls
          if (circle.pos[0] - circle.rad < 0) {
            circle.pos[0] = circle.rad;
            circle.vel[0] = -circle.vel[0] * 0.6 * (1 - 10 / circle.mass);
            circle.vel[1] *= 0.9995;
          } else if (circle.pos[0] + circle.rad > window.innerWidth) {
            circle.pos[0] = window.innerWidth - circle.rad;
            circle.vel[0] = -circle.vel[0] * 0.6 * (1 - 10 / circle.mass);
            circle.vel[1] *= 0.9995;
          }
      
          // Handle collisions with top and bottom walls
          if (circle.pos[1] - circle.rad < 0) {//top wall
            circle.pos[1] = circle.rad;
            circle.vel[1] = -circle.vel[1] * 2.6 * (1 - 10 / circle.mass);
            circle.vel[0] *= 0.9995;
          } else if (circle.pos[1] + circle.rad > window.innerHeight) {//bottom wall
            circle.pos[1] = window.innerHeight - circle.rad;
            circle.vel[1] = -circle.vel[1] * 2.6 * (1 - 10 / circle.mass);
            circle.vel[0] *= 0.9995;
          }
        });
      
   // collisions between objects
Circle.allInstances.forEach((obj, index) => {
    Circle.allInstances.slice(index + 1).forEach(col => {
      const hypot = Math.hypot(col.pos[0] - obj.pos[0], col.pos[1] - obj.pos[1]);
      const overlap = hypot - col.rad - obj.rad;
      if (overlap < 0) {
        const vCollision = {x: col.pos[0] - obj.pos[0], y: col.pos[1] - obj.pos[1]};
        const distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);
        const vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        const vRelativeVelocity = {x: col.vel[0] - obj.vel[0], y: col.vel[1] - obj.vel[1]};
        const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        if (speed < 0) {
          const e = 0.8; // coefficient of restitution
          const mu = 0.2; // coefficient of friction
          const impulse = - (1 + e) * speed / (1 / obj.mass + 1 / col.mass);
          obj.vel[0] -= (impulse / obj.mass) * vCollisionNorm.x;
          obj.vel[1] -= (impulse / obj.mass) * vCollisionNorm.y;
          col.vel[0] += (impulse / col.mass) * vCollisionNorm.x;
          col.vel[1] += (impulse / col.mass) * vCollisionNorm.y;
          // add tangent velocity
          const tangent = {x: -vCollisionNorm.y, y: vCollisionNorm.x};
          const impulseTangent = - mu * impulse;
          obj.vel[0] -= (impulseTangent / obj.mass) * tangent.x;
          obj.vel[1] -= (impulseTangent / obj.mass) * tangent.y;
          col.vel[0] += (impulseTangent / col.mass) * tangent.x;
          col.vel[1] += (impulseTangent / col.mass) * tangent.y;
          // add angular velocity
          const radius = obj.rad;
          const r1 = {x: obj.pos[0] - col.pos[0], y: obj.pos[1] - col.pos[1]};
          const r2 = {x: col.pos[0] - obj.pos[0], y: col.pos[1] - obj.pos[1]};
          const n = {x: vCollisionNorm.x, y: vCollisionNorm.y};
          const angularVelocity1 = (r1.x * n.y - r1.y * n.x) * (impulse / radius);
          const angularVelocity2 = (r2.x * n.y - r2.y * n.x) * (impulse / radius);
          obj.angularVel += angularVelocity1;
          col.angularVel += angularVelocity2;
        }
      }  

    });
});
   //walls
    

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


c.addEventListener("mousedown", function(e) { 
    var cX = Math.round(e.clientX/c.getBoundingClientRect().width * window.innerWidth);
    var cY = Math.round(e.clientY/c.getBoundingClientRect().height * window.innerHeight);
    mouseCoords = [cX, cY];

    c.addEventListener("mouseup", (event) => {
        var cX2 = Math.round(event.clientX/c.getBoundingClientRect().width * window.innerWidth);
        var cY2 = Math.round(event.clientY/c.getBoundingClientRect().height * window.innerHeight);
        mouseCoords2 = [-(cX2 - cX)/100, -(cY2 - cY)/10];
    });
    addObject(mouseCoords[0], mouseCoords[1], mouseCoords[2], 100);
});



const world = new Render(ctx, window.innerWidth, window.innerHeight, 9.8);

Circle.allInstances = [];
world.render();
