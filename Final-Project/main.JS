import * as THREE from 'three';
import './style.css'
import gsap from "gsap";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

let clock = new THREE.Clock();
let delta = 0;

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

//Scene

const scene = new THREE.Scene();
{
  const color = "#010613";  // black
  const near = 45;
  const far = 155;
  scene.fog = new THREE.Fog(color, near, far);
}
scene.background = new THREE.Color("#000000");


//Camera
const camera = new THREE.PerspectiveCamera( 45, sizes.width/sizes.height, 0.1, 700);
camera.position.z = 150;
scene.add( camera );


//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(2);
renderer.render(scene, camera);


//Display Board
/*
const planeSize = 100;
     
const loader = new THREE.TextureLoader();
const texture = loader.load('checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = Math.PI * -.5;
scene.add(plane);
*/


//Create Objects

//material
const material = new THREE.MeshStandardMaterial( { 
  color: "#6A7184",
  roughness: 0.2
} );

const glassMaterial = new THREE.MeshPhysicalMaterial({  
  roughness: 0,  
  transmission: 1,  
  thickness: 0.5, // Add refraction!
  color:"#ffffff"
});

//ball
const ballGeometry = new THREE.SphereGeometry( 1, 64, 64 );
const ball = new THREE.Mesh( ballGeometry, material );
ball.position.set (3, 15, 1);

//glowyballs
const gballGeometry = new THREE.SphereGeometry(1.0, 64, 64);
for (let i = 0; i < 5; i++){
  const gballs = [];
  gballs[i] = new THREE.Mesh( gballGeometry, material);
  gballs[i].position.set (getRand(-50, 50), getRand(-15, 15), getRand(-50, 50));
  scene.add( gballs[i] );
}

//buildings
const buildingGeometry = new THREE.BoxGeometry(5, 5, 25);
for (let i = 0; i < getRand(75, 90); i++){
  const buildings = [];
  buildings[i] = new THREE.Mesh( buildingGeometry, material);
  buildings[i].position.set (getRand(-55, 55), getRand(-55, 55), getRand(5, 25));
  scene.add( buildings[i] );
}

//glassCubes
const glassCubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const glassCubes = [];
for (let i = 0; i < 3; i++){
  glassCubes[i] = new THREE.Mesh( glassCubeGeometry, glassMaterial);
  glassCubes[i].position.set (getRand(-35, 35), getRand(-35, 35), getRand(55, 75));
  scene.add ( glassCubes[i] ); 
}


//Smoke Textures
const smokeTexture = new THREE.TextureLoader().load("Smoke2.png");
smokeTexture.encoding = THREE.sRGBEncoding;
const smokeGeometry = new THREE.PlaneGeometry(300, 300);
const smokeMaterial = new THREE.MeshLambertMaterial({

  map: smokeTexture,
  color: "#051659",
  opacity: 0.35,
  transparent: true
});

let smokeParticles = [];
for (let i = 0; i < 20; i++){
let smokeElement = new THREE.Mesh(smokeGeometry, smokeMaterial);

smokeElement.scale.set(2, 2, 2);
smokeElement.position.set(getRand(-50, 50), getRand(-50, 50), getRand(-50, 50));
smokeElement.rotation.z = Math.random() * 360;

scene.add(smokeElement);
smokeParticles.push(smokeElement);
}


//Light
const light = new THREE.HemisphereLight("#ffffff", "#000000", 12.0);
scene.add( light );


//Resize on window change
window.addEventListener("resize", () => {

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
})

//const effect = new EffectComposer()


//Color change mouse movement
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;
//controls.autoRotate = true;
controls.autoRotateSpeed = 2;

const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();

const t1 = gsap.timeline({defaults: {duration: 1} });
t1.fromTo(ball.scale, {z:0, x:0, y:0}, {z: 1, x: 1, y: 1})


//mouse animation color
/*
let mouseDown = false;
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(ball.material.color, {r: newColor.r, g: newColor.g, b: newColor.b});
  }
})
*/

//Animation function
function animate() {
	requestAnimationFrame( animate );

  delta = clock.getDelta();

  for (let i = 0; i < smokeParticles.length; i++){
    smokeParticles[i].rotation.z +=(delta * -0.12);
  }

  scene.rotation.z +=(delta * 0.05);
  
  glassCubes[0].rotation.x += 0.008;
  glassCubes[0].rotation.y += 0.008;
  glassCubes[0].rotation.z += 0.008;

  glassCubes[1].rotation.x += 0.008;
	glassCubes[1].rotation.y += 0.008;
  glassCubes[1].rotation.z += 0.008;

  glassCubes[2].rotation.x += 0.008;
	glassCubes[2].rotation.y += 0.008;
  glassCubes[2].rotation.z += 0.008;
	

	renderer.render(scene, camera);
}

animate();


