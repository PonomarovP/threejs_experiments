var container, renderer, scene, camera, effect, light, pointlight, loader;
var spritelist = [];

$(document).ready(function () {
    init3D();
    animate();
});

function init3D() {
    container = document.getElementById('container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 5000;
    camera.position.x = 5000;
    camera.position.y = 5000;

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x89DAF5, 1);
    effect = new THREE.StereoEffect(renderer);
    effect.eyeSeparation = 0;
    effect.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.center.set(0, 500, 0);
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };

    loader = new THREE.OBJLoader();
    loader.load('obj/cs_italy.obj', function (object) {
        object.traverse(function (child)
        {
            if (child instanceof THREE.Mesh)
                child.material.color.setRGB(0.3, 0.3, 0.3);
        });
        scene.add(object);
    }, onProgress, onError);

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
        container.addEventListener('click', goFullScreen(container), false);
        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);

    container.appendChild(renderer.domElement);

    pointlight = new THREE.PointLight(0xffffff, 1, 1000000);
    pointlight.position.set(0, 2500, 0);
    light = new THREE.AmbientLight({color: 0xffffff});
    scene.add(light);
    scene.add(pointlight);
    var pointLightHelper = new THREE.PointLightHelper(pointlight, 10);
    scene.add(pointLightHelper);

//    var cube = new THREE.Mesh(new THREE.BoxGeometry(500, 500, 500), new THREE.MeshLambertMaterial({color: 0xff0000}));
//    spritelist.push(cube);
//    cube.position.set(0, 0, 0);
//    scene.add(cube);

    //initSky();
}

function goFullScreen(element) {
    console.log("request fullscreen");
    if (BigScreen.enabled) {
        BigScreen.request(element);
        // You could also use .toggle(element, onEnter, onExit, onError)
    }
    else {
        // fallback for browsers that don't support full screen
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
//    spritelist[0].rotation.x += 0.01;
//    spritelist[0].rotation.z += 0.01;
    controls.update();
    effect.render(scene, camera);
}
