var obstacles = [];

function Obstacle(x, z, width, height) {
  this.x = x;
  this.z = z;
  this.width = width;
  this.height = height;
}

function makeTestObstacles() {
  obstacles.push(new Obstacle(100, -300, 100, 100));
  obstacles.push(new Obstacle(-100, -300, 100, 100));
  obstacles.push(new Obstacle(150, -400, 100, 100));
  obstacles.push(new Obstacle(50, -500, 100, 100));
}

function createObstacles() {
  var geometry;
  // var material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xaaaaaa, shininess: 10, emissive: 0x111111 } );
  var material;
  var obstacle;

  for (var i = 0; i < obstacles.length; i++) {
    geometry = new THREE.BoxGeometry( obstacles[i].width, obstacles[i].height, obstacles[i].width );
    material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(buildingTexture) } );
    obstacle = new THREE.Mesh( geometry, material );
    obstacle.position.y += obstacles[i].height / 2;
    obstacle.position.x = obstacles[i].x;
    obstacle.position.z = obstacles[i].z;
    debugger;
    scene.add( obstacle );
  }

  renderer.render(scene, camera);
}

var groundWidth = 5000;

var scene, camera, renderer, viewer;
var cameraRotateDegree = 90;
var farDistance = 10000;

init();
makeTestObstacles();
createObstacles();
renderer.render(scene, camera);
// animate();

createObstacle();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, farDistance );
    camera.position.set(0, 10, 0);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(farDistance * Math.cos(cameraRotateDegree * 2 * Math.PI / 360), 10, -farDistance * Math.sin(cameraRotateDegree * 2 * Math.PI / 360)));

    // 조명 세팅
    // AMBIENT
    var ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);

    var light = new THREE.PointLight( 0xeeeeee, 1, 0 );
    light.position.set( 100, 200, 100 );

    scene.add( light );

    createGorund();
    createViewer();
    createSkybox();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;

    document.body.appendChild( renderer.domElement );
}

function createGorund() {
    // var geometry = new THREE.PlaneGeometry( 200, 200, 10, 10 );
    var geometry = new THREE.BoxGeometry( groundWidth, groundWidth, groundWidth );
    // var material = new THREE.MeshPhongMaterial( { color: 0x8AB5BF, specular: 0x555555, shininess: 50 } );
    var texture = THREE.ImageUtils.loadTexture(asphaltTexture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // texture.minFilter = THREE.LinearFilter;
    texture.repeat.set( 400, 400 );
    // texture.needsUpdate = true; 
    var material = new THREE.MeshPhongMaterial( { map: texture, side: THREE.DoubleSide } );
    var ground = new THREE.Mesh( geometry, material );

    ground.position.y -= groundWidth / 2;
    ground.receiveShadow = true;
    scene.add( ground );
}

function createObstacle() {
    var obstacleHeight = 30;
    var geometry = new THREE.BoxGeometry( obstacleHeight, obstacleHeight, obstacleHeight );
    // var material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xaaaaaa, shininess: 10, emissive: 0x111111 } );
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(buildingTexture) } );
    var obstacle = new THREE.Mesh( geometry, material );

    obstacle.position.y += obstacleHeight / 2;
    obstacle.position.z -= 100;
    scene.add( obstacle );
    renderer.render(scene, camera);
}

function createSkybox() {
  var texture = THREE.ImageUtils.loadTexture(skyTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );

  // var skyBoxGeometry = new THREE.SphereGeometry( groundWidth, 100, 100 );
  var skyBoxGeometry = new THREE.BoxGeometry( groundWidth, 2 * groundWidth, groundWidth );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x58C4E8, side: THREE.BackSide } );

  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add( skyBox );
}

function createViewer() {
    var loader = new THREE.OBJLoader();
    // loader.load( 'assets/objs/man.obj', function ( object ) {
    loader.load( viewerObj, function ( object ) {
      viewer = object;
      object.position.set(0, 0, -15);
      object.scale.set(0.005, 0.005, 0.005);
      object.rotateY(90)
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material.color.setRGB (0.7, 0.7, 0.7);
        }
      });
      scene.add( object );
      renderer.render(scene, camera);
    });
}

var isRotating = 0;
var rotateNum = 0;
var rotateAniId;

function rotateCamera(dir) {
    var repeatNum = 10;

    if (rotateNum === repeatNum) {
        cancelAnimationFrame(rotateAniId);
        isRotating = 0;
        rotateNum = 0;

        return;
    }

    rotateAniId = requestAnimationFrame( rotateCamera.bind(this, dir) );

    cameraRotateDegree += dir * (10 / repeatNum);

    var cameraPos = camera.position;
    var viewerPos = viewer.position;

    camera.position.set = (cameraPos.x += (viewerPos.x - cameraPos.x) - (15 * Math.cos(cameraRotateDegree * 2 * Math.PI / 360)),
                            0,
                            cameraPos.z += (viewerPos.z - cameraPos.z) + (15 * Math.sin(cameraRotateDegree * 2 * Math.PI / 360)));
    camera.lookAt(new THREE.Vector3(cameraPos.x + farDistance * Math.cos(cameraRotateDegree * 2 * Math.PI / 360), 10, cameraPos.z + -farDistance * Math.sin(cameraRotateDegree * 2 * Math.PI / 360)));
    viewer.lookAt(new THREE.Vector3(viewerPos.x + farDistance * Math.cos((cameraRotateDegree - 65) * 2 * Math.PI / 360), 10, viewerPos.z + -farDistance * Math.sin((cameraRotateDegree - 65) * 2 * Math.PI / 360)));

    renderer.render( scene, camera );
    rotateNum++;
}

function render() {
    rotateCamera();
    renderer.render(scene, camera);
}

var isMoving = 0;
var moveNum = 0;
var moveAniId;

function moveForward(dir) {
    if (moveNum === 10) {
        cancelAnimationFrame(moveAniId);
        isMoving = 0;
        moveNum = 0;

        return;
    }

    moveAniId = requestAnimationFrame( moveForward.bind(this, dir) );

    var cameraPos = camera.position;
    var viewerPos = viewer.position;

    camera.position.set = (cameraPos.x += dir * Math.cos(cameraRotateDegree * 2 * Math.PI / 360),
                            0,
                            cameraPos.z += -dir * Math.sin(cameraRotateDegree * 2 * Math.PI / 360));
    viewer.position.set = (viewerPos.x += dir * Math.cos(cameraRotateDegree * 2 * Math.PI / 360),
                            0,
                            viewerPos.z += -dir * Math.sin(cameraRotateDegree * 2 * Math.PI / 360));

    renderer.render( scene, camera );
    moveNum++;
}

document.addEventListener('keydown', function(e) {
    var KEY_W = 87;
    var KEY_D = 68;
    var KEY_S = 83;
    var KEY_A = 65;

    switch(e.keyCode) {
        case KEY_W:
            if (isMoving === 0) isMoving = 1; moveForward(1);
            break;
        case KEY_D:
            if (isRotating === 0) isRotating = 1; rotateCamera(-1);
            break;
        case KEY_A:
            if (isRotating === 0) isRotating = 1; rotateCamera(1);
            break;
        case KEY_S:
            if (isMoving === 0) isMoving = 1; moveForward(-1);
            break;
        default:
        break;
    }
});