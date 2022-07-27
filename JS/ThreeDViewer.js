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

//function STLViewer(model, elementID) {}
function ThreeDViewer(model, elem) {

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

        // Animation
        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        measure();
    });
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