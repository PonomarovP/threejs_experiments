var THREE = require('three');

function Ball(args){
    if(!args) args = {};
    this.position = {};
    this.position.x = args.x | 0;
    this.position.y = args.y | 0;
    this.position.z = args.z | 0;
    this.size = args.size | 10;
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(this.size, 16, 16), new THREE.MeshStandardMaterial( {color: 0xff0000} ));
    this.sphere.position.set(this.position.x, this.position.y, this.position.z);
}

Ball.prototype = {
    addToScene: function(scene){
        scene.add(this.sphere);
    },
    setPos: function(x, y, z){
        this.sphere.position.set(x, y, z);
    },
    
    move: function(dx, dy, dz){
        this.sphere.position.x += dx;
        this.sphere.position.y += dy;
        this.sphere.position.z += dz;
    },
    
    getPos: function(){
        return {x: this.sphere.position.x, y: this.sphere.position.y, z: this.sphere.position.z};
    }
};

module.exports = Ball;



