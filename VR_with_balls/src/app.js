var THREE = require('three');
var Lightbulb = require('objects/Lightbulb');
var Ball = require('objects/Ball');
var OrbitControls = require('three-orbit-controls')(THREE);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 400;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

var ambient_light = new THREE.AmbientLight(0x404040);
scene.add(ambient_light);

var lights = [], objects = [];

window.addEventListener('resize', onWindowResize, false);

function init(){
    var bulb = new Lightbulb({size: 10, intensity: 150});
    bulb.addToScene(scene);
    lights.push(bulb);
    var ball1 = new Ball({size: 20, x: 40, y:50, z: 0});
    ball1.addToScene(scene);
    var ball2 = new Ball({size: 15, x: -40, y:50, z: 0});
    ball2.addToScene(scene);
    console.log(lights[0].getPos());
}

var frame = 0;
function animate() {
    //requestAnimationFrame(animate);
    if(frame < 250){
        lights[0].move(0, 0.3, 0.1);
    }else if(frame < 500){
        lights[0].move(0, -0.3, -0.1);
    }else{
        frame = 0;
    }
    controls.update();
    renderer.render(scene, camera);
    frame++;
}

init();
setInterval(animate,50);
//animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


