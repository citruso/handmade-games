var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

camera.position.set(0, 10, 50);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, 180);
renderer.domElement.style.height = '100vh'
setTimeout(() => document.body.appendChild(renderer.domElement), 0);

var division = 20;
var limit = 100;
var grid = new THREE.GridHelper(limit*2, division, "red", 0xffff00);

var moveable = [];

for (let i = 0; i <= division; i++) {
  moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
}

grid.geometry.addAttribute(
  "moveable",
  new THREE.BufferAttribute(new Uint8Array(moveable), 1)
);

grid.material = new THREE.ShaderMaterial({
  uniforms: {
    time: {
      value: 0
    },
    limits: {
      value: new THREE.Vector2(-limit, limit)
    },
    speed: {
      value: 50
    }
  },
  vertexShader: `
    uniform float time;
    uniform vec2 limits;
    uniform float speed;

    attribute float moveable;

    varying vec3 vColor;

    void main() {
      vColor = color;
      float limLen = limits.y - limits.x;
      vec3 pos = position;
      if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1
        float dist = speed * time;
        float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
        pos.z = currPos;
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.);
    }
  `,
  vertexColors: THREE.VertexColors
});
var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
var basicMaterial = new THREE.MeshBasicMaterial({color: 0x0095DD});
var cube = new THREE.Mesh(boxGeometry, basicMaterial);
scene.add(grid);
scene.add(cube)

renderer.domElement.onmousemove = e => {
  cube.position.x = e.x/50
  cube.position.y = e.y/50
}

var clock = new THREE.Clock();
var time = 0;

render();

function render() {
  requestAnimationFrame(render);
  time += clock.getDelta();
  grid.material.uniforms.time.value = time;
  renderer.render(scene, camera);
}
