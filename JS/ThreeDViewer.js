const fflate = require('fflate');
//const { ThreeMFLoader } = require('JS/examples/jsm/loaders/3MFLoader.js');


function disposeAll() {
    for (const model of models) {
        model.geometry && model.geometry.dispose();
        model.material && model.material.dispose();
        model.texture && model.texture.dispose();
    }
    models = [];

    for (const renderer of renderers) {
        renderer.dispose();
    }
    renderers = [];
}

function ThreeDViewer(model, elem) {

    const ext = model.slice(model.lastIndexOf(".") + 1);

    const measure = () => {
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth / elem.clientHeight;
        camera.updateProjectionMatrix();
    }

    model = model.replace(/\\/g, '/').replace(/^dist\//, '');

    // Camera
    var camera = new THREE.PerspectiveCamera(70,
        elem.clientWidth / elem.clientHeight, 1, 1000);

    // Renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    renderer.setClearColor(0x000000, 0);
    elem.appendChild(renderer.domElement);

    renderers.push(renderer);

    window.addEventListener('resize', function () {
        measure();
    }, false);


    // Controls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.2;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;

    // Scene
    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
    switch (ext) {
        case '3mf': // -------------------------------- 3MF
            const loader = new THREE.ThreeMFLoader();
            loader.load(model, function (object) {
                object.quaternion.setFromEuler(new THREE.Euler(- Math.PI / 2, 0, 0)); 	// z-up conversion
    
                object.traverse(function (child) {
                    child.castShadow = true;
                });

                //object.position.set(- 100, - 20, -100);
                scene.add(object);
                camera.position.z = 100;
                animate();
                measure();
            });
            break;
        case 'gcode': // -------------------------------- GCODE
            const loadergcode = new THREE.GCodeLoader();
            loadergcode.load(model, function (object) {
                scene.add(object);
                camera.position.z = 100;
                animate();
                measure();
            });
            break;
        case 'stl': // -------------------------------- STL
            (new THREE.STLLoader()).load(model, function (geometry) {
                var material = new THREE.MeshPhongMaterial({
                    color: colorSTL,
                    specular: 100,
                    shininess: 100
                });
                var mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                // Object
                mesh.rotation.x = -Math.PI / 2;
                var middle = new THREE.Vector3();
                geometry.computeBoundingBox();
                geometry.boundingBox.getCenter(middle);
                mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z));

                var largestDimension = Math.max(geometry.boundingBox.max.x, geometry.boundingBox.max.y, geometry.boundingBox.max.z);
                camera.position.z = largestDimension * 2.2;

                models.push(mesh);

                animate();

                measure();
            });
            break;
        default:
            console.log("pas pris en charge");
    }

    // Animation
    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
}

function plusSize() {
    if (sizeViewer < 1000) {
        sizeViewer += 100;
        changeSizeViewer();
    }
}

function minusSize() {
    if (sizeViewer > 200) {
        sizeViewer -= 100;
        changeSizeViewer();
    }
}

function changeSizeViewer() {
    css.cssRules[0].style.width = sizeViewer + "px";
    css.cssRules[0].style.height = sizeViewer + "px";
}