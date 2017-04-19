var THREE = require('three');

function Lightbulb(args){
    if(!args) args = {};
    this.position = {};
    this.intensity = args.intensity | 60;
    this.position.x = args.x | 0;
    this.position.y = args.y | 0;
    this.position.z = args.z | 0;
    this.size = args.size | 10;
    this.light = new THREE.PointLight(0xff0000, 1, this.intensity);
    this.light.position.set(this.position.x, this.position.y, this.position.z);
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(this.size, 16, 16), new THREE.MeshBasicMaterial( {color: 0xffee00} ));
    this.sphere.position.set(this.position.x, this.position.y, this.position.z);
}

Lightbulb.prototype = {
    addToScene: function(scene){
        scene.add(this.light);
        scene.add(this.sphere);
    },
    setPos: function(x, y, z){
        this.light.position.set(x, y, z);
        this.sphere.position.set(x, y, z);
    },
    
    move: function(dx, dy, dz){
        this.light.position.x += dx;
        this.light.position.y += dy;
        this.light.position.z += dz;
        this.sphere.position.x += dx;
        this.sphere.position.y += dy;
        this.sphere.position.z += dz;
    },
    
    getPos: function(){
        return {x: this.light.position.x, y: this.light.position.y, z: this.light.position.z};
    }
};

module.exports = Lightbulb;



