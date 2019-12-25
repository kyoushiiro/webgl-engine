'use strict';

import { Rect } from './geometries/Rect.js';
import { Cube } from './geometries/Cube.js';
import { Program } from './shaders/Program.js';
import { Camera } from './Camera.js';
import {
  rectVertexShaderSource,
  rectFragmentShaderSource,
} from './shaders/shaders.js';
import { Renderer } from './Renderer.js';

let objects = [];

let gl = null;
let canvas = null;

// Dictionary containing the names of all uniforms in each shader
// Keys: Program (already created with vertex/frag shader)
// Values: List of uniforms in the given shader
let uniformNames = {};

// Dictionary containing the names of all uniforms and their uniform location
// Keys: Uniform name (string)
// Values: WebGL Uniform Location
let uniforms = {};

let attributes = {};

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

  let rectProg = new Program(
    gl,
    'RectProgram',
    rectVertexShaderSource,
    rectFragmentShaderSource
  );
  gl.useProgram(rectProg.program);

  // Set and store uniform locations for rectangle shaders
  uniformNames[rectProg] = [
    'u_Color',
    'u_ViewMatrix',
    'u_ProjMatrix',
    'u_ModelMatrix',
  ];
  for (let u_var of uniformNames[rectProg]) {
    let uniformLocation = gl.getUniformLocation(rectProg.shader, u_var);
    // checkIfExists(uniformLocation, u_var);
    uniforms[u_var] = uniformLocation;
    rectProg.uniforms[u_var] = uniformLocation;
  }

  // Set and store attribute locations for rectangle shaders
  let positionAttributeLocation2 = gl.getAttribLocation(
    rectProg.shader,
    'a_Position'
  );
  attributes['a_Position'] = positionAttributeLocation2;
  rectProg.attributes['a_Position'] = positionAttributeLocation2;

  let color = [Math.random(), Math.random(), Math.random(), 1];
  objects.push(new Rect(rectProg, 50, 50, 200, 200, color));
  color = [Math.random(), Math.random(), Math.random(), 1];
  // objects.push(new Rect(rectProg, 250, 50, 200, 200, color));
  // color = [Math.random(), Math.random(), Math.random(), 1];
  // objects.push(new Rect(rectProg, 50, 250, 200, 200, color));

  color = [Math.random(), Math.random(), Math.random(), 1];
  objects.push(new Cube(rectProg, 100, 150, 100, 200, 200, 200, color));

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
  r.render(objects, camera);
}

//----------------------------------
// Run this code only
//----------------------------------
main();
