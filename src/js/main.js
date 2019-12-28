'use strict';

import { Rect } from './geometries/Rect.js';
import { Cube } from './geometries/Cube.js';
import { Program } from './shaders/Program.js';
import { Camera } from './Camera.js';
import { BASE_VERTEX_SOURCE, BASE_FRAGMENT_SOURCE } from './shaders/shaders.js';
import { Renderer } from './Renderer.js';

let objectsByShader = {};
let camera = null;

let gl = null;
let canvas = null;
let r = null;

let fov = 60;
let eyeX = 50,
  eyeY = 5,
  eyeZ = 50;

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
    if (e.keyCode == 65) {
      camera.moveEyeRight(-1);
    } else if (e.keyCode == 68) {
      camera.moveEyeRight(1);
    } else if (e.keyCode == 83) {
      camera.moveEyeForward(-1);
    } else if (e.keyCode == 87) {
      camera.moveEyeForward(1);
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
  gl.useProgram(baseShader.program);
  objectsByShader[baseShader] = [];

  let color = [0.8, 0.5, 0.7, 1];
  let floor = new Cube(baseShader, -300, -1, 300, 600, 1, 600, color);
  //floor.modelMatrix.translate(-5000, -5000, 0);
  objectsByShader[baseShader].push(floor);

  color = [Math.random(), Math.random(), Math.random(), 1];
  objectsByShader[baseShader].push(
    new Cube(baseShader, 0, 1, -10, 20, 20, 20, color)
  );

  camera = new Camera(
    eyeX,
    eyeY,
    eyeZ,
    eyeX,
    eyeY,
    eyeZ - 500,
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
