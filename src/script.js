import * as THREE from 'three';
import WEBVR from './WebVR';

const ready = cb => {
  /in/.test(document.readyState) // in = loadINg
    ? setTimeout(ready.bind(null, cb), 9)
    : cb();
}

// Reset camera and renderer on resize
const windowResize = (renderer, camera) => {
  const [ windowWidth, windowHeight ] = [ window.innerWidth, window.innerHeight ];
  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(windowWidth, windowHeight);
};

ready(function() {
  const [ windowWidth, windowHeight ] = [ window.innerWidth, window.innerHeight ];
  // Set up renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);
  renderer.vr.enabled = true;
  renderer.vr.userHeight = 0;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild( WEBVR.createButton( renderer, { frameOfReferenceType: 'eye-level' } ) );

  // Set up scene
  const scene = new THREE.Scene();

  // Add light to scene
  const light = new THREE.HemisphereLight(0xfff0f0, 0x606066)
  light.position.set(1, 1, 1);
  scene.add(light);

  // Add camera
  const camera = new THREE.PerspectiveCamera(40, windowWidth / windowHeight, 0.1, 500);
  camera.position.set(0, 0, 60);

  // Update dimensions on resize
  windowResize(renderer, camera)

  // Prepare geometries and meshes
  const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
  const moonGeometry = new THREE.SphereGeometry(3, 16, 16);
  const sunGeometry = new THREE.SphereGeometry(25, 80, 80);
  const loader = new THREE.TextureLoader()
  loader.crossOrigin = true;
  const earthTexture = loader.load('https://cdn.rawgit.com/josephrexme/csa/b639ba3e/images/earthmap.jpg');
  const moonTexture = loader.load('https://cdn.rawgit.com/josephrexme/csa/09bb2d3c/images/MoonColorMap.png');
  const sunTexture = loader.load('https://cdn.rawgit.com/josephrexme/csa/09bb2d3c/images/sun_texture.jpg');
  const earthMaterial = new THREE.MeshLambertMaterial({ map: earthTexture });
  const moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });
  const sunMaterial = new THREE.MeshLambertMaterial({ map: sunTexture });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  moon.translateY(10);
  moon.translateX(15);
  sun.translateY(-30);
  sun.translateX(-30);
  scene.add(earth);
  scene.add(moon);
  scene.add(sun);

  // render scene
  const render = () => {
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(render);
});
