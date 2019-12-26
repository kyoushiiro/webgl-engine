'use strict';

import { Rect } from './geometries/Rect.js';
import { Cube } from './geometries/Cube.js';
import { Program } from './shaders/Program.js';
import { Camera } from './Camera.js';
import { BASE_VERTEX_SOURCE, BASE_FRAGMENT_SOURCE } from './shaders/shaders.js';
import { Renderer } from './Renderer.js';

let objectsByShader = {};

let gl = null;
let canvas = null;

let fov = 60;
let eyeX = 250,
  eyeY = 250,
  eyeZ = 500;

function main() {
  // Set up WebGL 2
  canvas = document.getElementById('canv');
  canvas.width = 500;
  canvas.height = 500;
  gl = canvas.getContext('webgl2');

  let slider_fov = document.getElementById('slider_fov');
  fov = slider_fov.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider_fov.oninput = function() {
    fov = this.value;
    drawScene(canvas);
  };

  document.addEventListener('keydown', function(e) {
    if (e.keyCode == 65) {
      eyeX -= 5;
    } else if (e.keyCode == 68) {
      eyeX += 5;
    } else if (e.keyCode == 83) {
      eyeZ += 5;
    } else if (e.keyCode == 87) {
      eyeZ -= 5;
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
    ],
    ['a_Position', 'a_Color', 'a_Normal']
  );
  gl.useProgram(baseShader.program);
  objectsByShader[baseShader] = [];

  let color = [Math.random(), Math.random(), Math.random(), 1];
  let floor = new Rect(baseShader, 0, 0, 0, 10000, 10000, color);
  floor.modelMatrix.rotate(-90, 1, 0, 0);
  floor.modelMatrix.translate(-5000, -5000, 0);
  objectsByShader[baseShader].push(floor);

  color = [Math.random(), Math.random(), Math.random(), 1];
  objectsByShader[baseShader].push(
    new Cube(baseShader, 100, 150, 100, 200, 200, 200, color)
  );

  drawScene(canvas);
}

function drawScene(canvas) {
  let camera = new Camera(
    eyeX,
    eyeY,
    eyeZ,
    eyeX,
    eyeY,
    eyeZ - 500,
    canvas.width / canvas.height,
    fov
  );
  let r = new Renderer(canvas);
  for (let objList of Object.keys(objectsByShader)) {
    r.render(objectsByShader[objList], camera);
  }
}

//----------------------------------
// Run this code only
//----------------------------------
main();
