function Point3D(x,y,z) {
                
    this.x = x;
    this.y = y;
    this.z = z;

    this.rotateX = function(currentAngle) {
        
        var rad = currentAngle * Math.PI / 180;
        var cosa = Math.cos(rad);
        var sina = Math.sin(rad);
        var y = this.y * cosa - this.z * sina;
        var z = this.y * sina + this.z * cosa;
        
        return new Point3D(this.x, y, z);
    };

    this.rotateY = function(currentAngle) {
        
        var rad = currentAngle * Math.PI / 180;
        var cosa = Math.cos(rad);
        var sina = Math.sin(rad);
        var z = this.z * cosa - this.x * sina;
        var x = this.z * sina + this.x * cosa;
        
        return new Point3D(x,this.y, z);
    };

    this.rotateZ = function(currentAngle) {
        
        var rad = currentAngle * Math.PI / 180;
        var cosa = Math.cos(rad);
        var sina = Math.sin(rad);
        var x = this.x * cosa - this.y * sina;
        var y = this.x * sina + this.y * cosa;
        
        return new Point3D(x, y, this.z);
    };

    this.project = function(viewWidth, viewHeight, fieldOfView, viewDistance) {
        
        var factor = fieldOfView / (viewDistance + this.z);
        var x = this.x * factor + viewWidth / 2;
        var y = this.y * factor + viewHeight / 2;
        return new Point3D(x, y, this.z);
    };
}

var vertices = [
    new Point3D(-1,1,-1),
    new Point3D(1,1,-1),
    new Point3D(1,-1,-1),
    new Point3D(-1,-1,-1),
    new Point3D(-1,1,1),
    new Point3D(1,1,1),
    new Point3D(1,-1,1),
    new Point3D(-1,-1,1)
];

var cubeFaces = [[0,1,2,3],[1,5,6,2],[5,4,7,6],[4,0,3,7],[0,4,5,1],[3,2,6,7]]

var currentAngle = 0;

var screen = {
    w : window.innerWidth,
    h: window.innerWidth

};

function startRendering() {
    
    var canvas = document.getElementById("renderScreen");
    if (canvas && canvas.getContext) {
        
        canvas.width = screen.w;
        canvas.height = screen.h;
        
        ctx = canvas.getContext("2d");
        
        ctx.strokeStyle = "rgb(41,46,38)"

        requestAnimationFrame(renderLoop);
    }
}


function renderLoop() {
    
    var points = new Array();
    
    ctx.fillStyle = 'white';
    ctx.fillRect(10,10, screen.h, screen.w);
    
    vertices.map(function(vertex){ 
        points.push(vertex.rotateX(currentAngle).rotateY(currentAngle).rotateZ(currentAngle).project(screen.h, screen.w,128,7));
    });
    
    cubeFaces.map(function(cubeFace){
        ctx.beginPath();
        ctx.moveTo(points[cubeFace[0]].x,points[cubeFace[0]].y);
        ctx.lineTo(points[cubeFace[1]].x,points[cubeFace[1]].y);
        ctx.lineTo(points[cubeFace[2]].x,points[cubeFace[2]].y);
        ctx.lineTo(points[cubeFace[3]].x,points[cubeFace[3]].y);
        ctx.closePath();
        ctx.stroke();          
    });
    
    currentAngle += 2;

    requestAnimationFrame(renderLoop);
}

window.onload = startRendering;
