import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log("Starting Creative Constellations...");

// Setup canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Audio
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Resume AudioContext on first interaction (required by browser autoplay policies)
function resumeAudioContext() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  window.removeEventListener('click', resumeAudioContext);
  window.removeEventListener('keydown', resumeAudioContext);
}
window.addEventListener('click', resumeAudioContext);
window.addEventListener('keydown', resumeAudioContext);

// Persistent mute state via localStorage
let isMuted = localStorage.getItem('isMuted') === 'true' ? true : false;

function playSound() {
  if (isMuted) return;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400 + Math.random() * 300, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 2);
}

// Heading (top-left corner) container
const headingBox = document.createElement('div');
Object.assign(headingBox.style, {
  position: 'absolute',
  top: '20px',
  left: '20px',
  color: 'white',
  zIndex: 10,
  userSelect: 'none',
});
headingBox.innerHTML = `
<h1 style="margin: 0; font-size: 24px;">You have entered the Creative Constellations!</h1>
<p style="margin: 5px 0 10px 0; font-size: 16px;">Choose a star and see where it leads</p>
`;
document.body.appendChild(headingBox);

// Mute button under heading
const muteButton = document.createElement('button');
muteButton.textContent = isMuted ? '🔇 Sound Off' : '🔈 Mute Sound';
Object.assign(muteButton.style, {
  fontSize: '14px',
  padding: '6px 12px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#00ccff',
  color: 'black',
  userSelect: 'none',
});
muteButton.onclick = () => {
  isMuted = !isMuted;
  localStorage.setItem('isMuted', isMuted);
  muteButton.textContent = isMuted ? '🔇 Sound Off' : '🔈 Mute Sound';
};
headingBox.appendChild(muteButton);

// Info box (top-right)
const infoBox = document.createElement('div');
Object.assign(infoBox.style, {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '280px',
  backgroundColor: 'rgba(0,0,0,0.85)',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '15px',
              display: 'none',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
              zIndex: 10
});
document.body.appendChild(infoBox);

const infoTitle = document.createElement('h2');
infoTitle.style.margin = '5px 0';
infoBox.appendChild(infoTitle);

const infoDesc = document.createElement('p');
Object.assign(infoDesc.style, {
  fontSize: '0.9em',
  textAlign: 'center',
  marginBottom: '10px'
});
infoBox.appendChild(infoDesc);

const infoLink = document.createElement('a');
Object.assign(infoLink.style, {
  backgroundColor: '#00ccff',
  color: 'black',
  padding: '8px 12px',
  borderRadius: '5px',
  textDecoration: 'none'
});
infoLink.target = '_blank';
infoLink.textContent = 'Visit Site';
infoBox.appendChild(infoLink);

// Tooltip (two-line message)
const tooltip = document.createElement('div');
Object.assign(tooltip.style, {
  position: 'absolute',
  padding: '6px 10px',
  backgroundColor: 'rgba(0,0,0,0.85)',
              color: 'white',
              fontSize: '14px',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 20,
              display: 'none',
              whiteSpace: 'pre-line', // enables \n for line breaks
              textAlign: 'center',
});
document.body.appendChild(tooltip);

// Star data
const sites = [
  {
    name: 'A Soft Murmur',
    url: 'https://asoftmurmur.com/',
    desc: 'Custom ambient sound mixer for focus and relaxation.',
    thumb: 'https://i.imgur.com/IDvEqlO.png'
  },
{
  name: 'WindowSwap',
  url: 'https://window-swap.com/',
  desc: 'View short video clips of people’s window views worldwide.',
  thumb: 'https://i.imgur.com/lKwYFvB.png'
},
{
  name: 'Radio Garden',
  url: 'http://radio.garden/',
  desc: 'Explore live radio by rotating the globe.',
  thumb: 'https://i.imgur.com/Qi08fRx.png'
},
{
  name: 'FutureMe',
  url: 'https://www.futureme.org/',
  desc: 'Send emails to your future self.',
  thumb: 'https://i.imgur.com/Otd2kk3.png'
},
{
  name: 'Little Alchemy 2',
  url: 'https://littlealchemy2.com/',
  desc: 'Mix elements and discover new items.',
  thumb: 'https://i.imgur.com/ROQhQJ2.png'
},
{
  name: 'The Useless Web',
  url: 'https://theuselessweb.com/',
  desc: 'Take a random trip to a weird and fun site.',
  thumb: 'https://i.imgur.com/5fS1Pmx.png'
},
{
  name: 'Hemingway Editor',
  url: 'https://hemingwayapp.com/',
  desc: 'Improve your writing with readability feedback.',
  thumb: 'https://i.imgur.com/mUfFvIH.png'
},
{
  name: 'Bored Panda',
  url: 'https://www.boredpanda.com/',
  desc: 'Creative, funny, and inspiring articles & galleries.',
  thumb: 'https://i.imgur.com/VT3v5jD.png'
},
{
  name: 'Paper Toys',
  url: 'https://www.papertoys.com/',
  desc: 'Printable paper toy models and designs.',
  thumb: 'https://i.imgur.com/kxHKH6E.png'
},
{
  name: 'Noisli',
  url: 'https://www.noisli.com/',
  desc: 'Background noise generator for productivity.',
  thumb: 'https://i.imgur.com/1hHoEJS.png'
},
{
  name: 'This Person Does Not Exist',
  url: 'https://thispersondoesnotexist.com/',
  desc: 'AI-generated realistic human faces.',
  thumb: 'https://i.imgur.com/De3pPZq.png'
},
{
  name: 'Zoom Earth',
  url: 'https://zoom.earth/',
  desc: 'Live satellite images of Earth.',
  thumb: 'https://i.imgur.com/UqHkHZI.png'
},
{
  name: 'Explore.org',
  url: 'https://explore.org/livecams',
  desc: 'Live nature cams from all over the world.',
  thumb: 'https://i.imgur.com/8zp35xq.png'
},
{
  name: 'Way to Go',
  url: 'http://a-way-to-go.com/',
  desc: 'An interactive virtual forest journey.',
  thumb: 'https://i.imgur.com/7b0uPRt.png'
},
{
  name: 'Pixel Thoughts',
  url: 'https://www.pixelthoughts.co/',
  desc: 'A 60-second meditation tool for anxiety relief.',
  thumb: 'https://i.imgur.com/sUQOmXv.png'
},
{
  name: 'Wait But Why',
  url: 'https://waitbutwhy.com/',
  desc: 'Longform articles on science, life, and more.',
  thumb: 'https://i.imgur.com/GhWffvi.png'
},
{
  name: 'How Stuff Works',
  url: 'https://www.howstuffworks.com/',
  desc: 'Explains how everything around you works.',
  thumb: 'https://i.imgur.com/EiTs5kn.png'
},
{
  name: 'Unsplash',
  url: 'https://unsplash.com/',
  desc: 'Free high-res photos shared by photographers.',
  thumb: 'https://i.imgur.com/Fa6Q9Rk.png'
},
{
  name: 'Incredibox',
  url: 'https://www.incredibox.com/',
  desc: 'Make music with an interactive beatbox app.',
  thumb: 'https://i.imgur.com/dYnP9AI.png'
},
{
  name: 'Little Big Details',
  url: 'https://littlebigdetails.com/',
  desc: 'Showcases cool UI/UX design details.',
  thumb: 'https://i.imgur.com/2qJCsP1.png'
},
{
  name: 'Daylio',
  url: 'https://daylio.net/',
  desc: 'Micro-diary and mood tracker app website.',
  thumb: 'https://i.imgur.com/RmjZkEm.png'
},
{
  name: 'The Oatmeal',
  url: 'https://theoatmeal.com/',
  desc: 'Funny comics, quizzes, and cartoons.',
  thumb: 'https://i.imgur.com/4u15mkF.png'
},
{
  name: 'Hackaday',
  url: 'https://hackaday.com/',
  desc: 'DIY electronics and hacking projects.',
  thumb: 'https://i.imgur.com/gI2BUnx.png'
},
{
  name: 'MapCrunch',
  url: 'https://www.mapcrunch.com/',
  desc: 'Teleport to a random street view anywhere.',
  thumb: 'https://i.imgur.com/WMyxNXY.png'
}
];


// Star geometry and colors
const starGeometry = new THREE.SphereGeometry(2.0, 16, 16);

function getRandomColor() {
  const hue = Math.random();
  return new THREE.Color().setHSL(hue, 1, 0.6);
}

sites.forEach(site => {
  const starMaterial = new THREE.MeshStandardMaterial({ color: getRandomColor() });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.set(
    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60
  );
  star.userData = site;
  scene.add(star);
});

// Sparkling stars
const sparkleCount = 1000;
const sparkleGeometry = new THREE.BufferGeometry();
const sparklePositions = [];

for (let i = 0; i < sparkleCount; i++) {
  sparklePositions.push(
    (Math.random() - 0.5) * 500,
                        (Math.random() - 0.5) * 500,
                        (Math.random() - 0.5) * 500
  );
}
sparkleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sparklePositions, 3));

const sparkleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.7,
  transparent: true,
  opacity: 0.8
});
const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
scene.add(sparkles);

// Nebula texture billboard
const loader = new THREE.TextureLoader();
loader.load('/nebula.png', texture => {
  const nebulaMaterial = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });

  const nebula = new THREE.Sprite(nebulaMaterial);
  nebula.scale.set(100, 100, 1); // Width, height, depth
  nebula.position.set(-40, 20, -70); // Position in 3D space
  scene.add(nebula);
});

// Interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED = null;

function onMouseClick(event) {
  if (INTERSECTED && INTERSECTED.userData) {
    const data = INTERSECTED.userData;
    infoTitle.textContent = data.name;
    infoDesc.textContent = data.desc;
    infoLink.href = data.url;
    infoBox.style.display = 'flex';

    INTERSECTED.scale.set(1.5, 1.5, 1.5);
    setTimeout(() => INTERSECTED.scale.set(1, 1, 1), 500);

    playSound();

    // Open a popup window 80% of the screen size, centered
    const width = Math.floor(window.screen.width * 0.8);
    const height = Math.floor(window.screen.height * 0.8);
    const left = Math.floor((window.screen.width - width) / 2);
    const top = Math.floor((window.screen.height - height) / 2);

    window.open(
      data.url,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  }
}


function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.userData && object.userData.name) {
      tooltip.style.display = 'block';
      tooltip.style.left = `${event.clientX + 15}px`;
      tooltip.style.top = `${event.clientY + 15}px`;
      tooltip.textContent = `You will be transported to...\n${object.userData.name}`;
      INTERSECTED = object;
    } else {
      tooltip.style.display = 'none';
      INTERSECTED = null;
    }
  } else {
    tooltip.style.display = 'none';
    INTERSECTED = null;
  }
}

window.addEventListener('click', onMouseClick);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Twinkle sparkles
  sparkleMaterial.opacity = 0.6 + Math.sin(Date.now() * 0.002) * 0.2;

  renderer.render(scene, camera);
}
animate();
