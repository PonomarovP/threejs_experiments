<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8"> 
        <script src="lib/jquery-1.11.3.js"></script>
        <script src="lib/three.js"></script>
        <script src="lib/Mirror.js"></script>
        <script src="lib/WaterShader.js"></script>
        <script src="lib/OrbitControls.js"></script>
        <script src="lib/StereoEffect.js"></script>
        <title>Sea</title>
    </head>
    <body>
        <span id="cardboard" style="z-index: 2; position: absolute; top: 50px; right: 50px;"><img src="resource/cblogo.png" style="width: 50px;"/></span>
        <script>
            var container, stats;
            var camera, scene, renderer, controls, plane;

            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;

            var water;
            
            var VR = false;

            var parameters = {
                width: 2000,
                height: 2000,
                widthSegments: 250,
                heightSegments: 250,
                depth: 1500,
                param: 4,
                filterparam: 1
            }


            init();
            $("#cardboard").click(function () {
                effect = new THREE.StereoEffect(renderer);
                effect.eyeSeparation = 0;
                effect.setSize(window.innerWidth, window.innerHeight);
                VR = true;
            });
            //animate();

            function init() {
                container = document.createElement('div');
                document.body.appendChild(container);

                camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 3000000);
                camera.position.set(0, 500, 1000);
                scene = new THREE.Scene();

                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(renderer.domElement);

                particles = new Array();
                var PI2 = Math.PI * 2;

                var waterNormals = new THREE.ImageUtils.loadTexture('resource/waternormals.jpg');
                waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

                var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 10);
                light.position.set(-1, 1, -1);
                scene.add(light);

                water = new THREE.Water(renderer, camera, scene, {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: waterNormals,
                    alpha: 1.0,
                    sunDirection: light.position.clone().normalize(),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 50.0,
                });

                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.userPan = false;
                controls.userPanSpeed = 0.0;
                controls.maxDistance = 5000.0;
                controls.maxPolarAngle = Math.PI * 0.495;
                controls.center.set(0, 500, 0);


                mirrorMesh = new THREE.Mesh(
                        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
                        water.material
                        );

                mirrorMesh.add(water);
                mirrorMesh.rotation.x = -Math.PI * 0.5;
                scene.add(mirrorMesh);

                initSky();
                initShip();

                //renderer.render(scene, camera);
            }

            function initShip() {
                var img = new THREE.MeshBasicMaterial({//CHANGED to MeshBasicMaterial
                    map: THREE.ImageUtils.loadTexture('resource/ship.png'),
                    side: THREE.DoubleSide
                });
                //img.map.needsUpdate = true; //ADDED
                img.transparent = true;
                // plane
                plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 400), img);
                plane.overdraw = true;
                plane.position.set(0, 180, 0);

                scene.add(plane);
            }

            function initSky() {
                var cubeMap = new THREE.CubeTexture([]);
                cubeMap.format = THREE.RGBFormat;
                cubeMap.flipY = false;

                var loader = new THREE.ImageLoader();
                loader.load('resource/skyboxsun25degtest.png', function (image) {

                    var getSide = function (x, y) {

                        var size = 1024;

                        var canvas = document.createElement('canvas');
                        canvas.width = size;
                        canvas.height = size;

                        var context = canvas.getContext('2d');
                        context.drawImage(image, -x * size, -y * size);

                        return canvas;

                    };

                    cubeMap.images[ 0 ] = getSide(2, 1); // px
                    cubeMap.images[ 1 ] = getSide(0, 1); // nx
                    cubeMap.images[ 2 ] = getSide(1, 0); // py
                    cubeMap.images[ 3 ] = getSide(1, 2); // ny
                    cubeMap.images[ 4 ] = getSide(1, 1); // pz
                    cubeMap.images[ 5 ] = getSide(3, 1); // nz
                    cubeMap.needsUpdate = true;

                });

                var cubeShader = THREE.ShaderLib['cube'];
                cubeShader.uniforms['tCube'].value = cubeMap;

                var skyBoxMaterial = new THREE.ShaderMaterial({
                    fragmentShader: cubeShader.fragmentShader,
                    vertexShader: cubeShader.vertexShader,
                    uniforms: cubeShader.uniforms,
                    depthWrite: false,
                    side: THREE.BackSide
                });

                var skyBox = new THREE.Mesh(
                        new THREE.BoxGeometry(1000000, 1000000, 1000000),
                        skyBoxMaterial
                        );

                scene.add(skyBox);
            }

            var sign = 1;
            var rotation = 0;
            function swingShip() {
                var angle = 0.07;
                var acc = 1e-5;
                if (rotation > (angle - acc) && rotation < (angle + acc)) {
                    sign = -1;
                }
                if (rotation > (-angle - acc) && rotation < (-angle + acc))
                    sign = 1;
                plane.rotation.z += sign * 0.0003;
                plane.position.y -= sign * 0.09;
                rotation += sign * 0.001;
            }

            function animate() {

                requestAnimationFrame(animate);
                render();

            }
            animate();

            function render() {

                //   var time = performance.now() * 0.001;

                swingShip();
                water.material.uniforms.time.value += 1.0 / 60.0;
                controls.update();
                camera.lookAt(plane.position);
                water.render();
                if(!VR){
                    renderer.render(scene, camera);
                }else{
                    effect.render( scene, camera );
                }
            }

        </script>
    </body>
</html>
