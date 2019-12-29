'use strict';

import { Cube } from './geometries/Cube.js';
import { Program } from './shaders/Program.js';
import { Camera } from './Camera.js';
import { BASE_VERTEX_SOURCE, BASE_FRAGMENT_SOURCE } from './shaders/shaders.js';
import { Renderer } from './Renderer.js';
import exampleObj from './../../example.obj';
import berb from './../../berb.obj';
import { Obj } from './geometries/Obj.js';

let objectsByShader = {};
let camera = null;

let gl = null;
let canvas = null;
let r = null;

let fov = 60;
let eyeX = 2,
  eyeY = 1,
  eyeZ = 5;

let pitch = 0;
let yaw = 0;

function main() {
  // Set up WebGL 2
  canvas = document.getElementById('canv');
  canvas.width = 800;
  canvas.height = 800;
  gl = canvas.getContext('webgl2');

  let slider_fov = document.getElementById('slider_fov');
  fov = slider_fov.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider_fov.oninput = function() {
    fov = this.value;
    drawScene(canvas);
  };

  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  document.exitPointerLock =
    document.exitPointerLock || document.mozExitPointerLock;

  canvas.addEventListener('click', function() {
    canvas.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

  function lockChangeAlert() {
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas
    ) {
      document.addEventListener('mousemove', updateRotation, false);
    } else {
      document.removeEventListener('mousemove', updateRotation, false);
    }
  }

  function updateRotation(e) {
    yaw -= e.movementX * 0.003;
    pitch -= e.movementY * 0.003;
    drawScene();
  }

  document.addEventListener('keydown', function(e) {
    let speed = 0.03;
    if (e.keyCode == 65) {
      camera.moveEyeRight(-speed);
    } else if (e.keyCode == 68) {
      camera.moveEyeRight(speed);
    } else if (e.keyCode == 83) {
      camera.moveEyeForward(-speed);
    } else if (e.keyCode == 87) {
      camera.moveEyeForward(speed);
    } else {
      return;
    }
    drawScene(canvas);
  });

  let baseShader = new Program(
    gl,
    'Base Shader',
    BASE_VERTEX_SOURCE,
    BASE_FRAGMENT_SOURCE,
    [
      'u_ViewMatrix',
      'u_ProjMatrix',
      'u_ModelMatrix',
      'u_LightColor',
      'u_LightDir',
      'u_AmbientColor',
      'u_Ka',
      'u_Kd',
    ],
    ['a_Position', 'a_Color', 'a_Normal']
  );
  // gl.useProgram(baseShader.program);
  objectsByShader[baseShader] = [];

  let color = [0.8, 0.5, 0.7, 1];
  let floor = new Cube(baseShader, -100, -1, 100, 200, 1, 200, color);
  objectsByShader[baseShader].push(floor);

  color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2, 1];
  objectsByShader[baseShader].push(
    new Cube(baseShader, 0, 0, -10, 1, 1, 1, color)
  );

  let monkey = new Obj(baseShader, exampleObj);
  monkey.modelMatrix.translate(0, 2, 0);
  objectsByShader[baseShader].push(monkey);

  let berbObj = new Obj(baseShader, berb);
  berbObj.modelMatrix.translate(0, 0, -5);
  berbObj.modelMatrix.scale(0.005, 0.005, 0.005);
  console.log(berb);
  objectsByShader[baseShader].push(berbObj);

  camera = new Camera(
    eyeX,
    eyeY,
    eyeZ,
    pitch,
    yaw,
    canvas.width / canvas.height,
    fov
  );
  camera.updateFPSView(pitch, yaw);
  r = new Renderer(canvas, gl);
  drawScene();
}

function drawScene() {
  camera.updateFPSView(pitch, yaw);
  // camera.updateEye(eyeX, eyeY, eyeZ);
  for (let objList of Object.keys(objectsByShader)) {
    r.render(objectsByShader[objList], camera);
  }
}

//----------------------------------
// Run this code only
//----------------------------------
main();
