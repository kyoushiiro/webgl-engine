"use strict";

import { RenderObj } from './RenderObj.js';
import { Rect } from './Rect.js';
import { FShape } from './FShape.js';
import { Matrix4 } from './cuon-matrix.js';
import { Program } from './webgl-utils.js';
import { textureVertexShaderSource, textureFragmentShaderSource, 
        rectVertexShaderSource, rectFragmentShaderSource } from './shaders.js';

let objects = []

let gl = null;
let canvas = null;

// Dictionary containing the names of all uniforms in each shader
// Keys: Program (already created with vertex/frag shader)
// Values: List of uniforms in the given shader
let uniformNames = {}

// Dictionary containing the names of all uniforms and their uniform location
// Keys: Uniform name (string)
// Values: WebGL Uniform Location
let uniforms = {}

let attributes = {}

let fov = 60;
let eyeX = 250, eyeY = 250, eyeZ = -500;
let lookX = 250, lookY = 250, lookZ = 0;

function main() {
  // Set up WebGL 2
  canvas = document.getElementById("canv")
  canvas.width = 500
  canvas.height = 500
  gl = canvas.getContext("webgl2")
  checkIfExists(gl, "WebGL2 context")

  let slider_fov = document.getElementById("slider_fov");
  fov = slider_fov.value; // Display the default slider value
  
  // Update the current slider value (each time you drag the slider handle)
  slider_fov.oninput = function() {
    fov = this.value;
    drawScene(gl, canvas);
  }

  document.addEventListener("keydown", function(e) {
    if(e.keyCode == 65){
        eyeX -= 5;
        lookX -= 5;
    }
    else if(e.keyCode == 68) {
        eyeX += 5;
        lookX += 5;
    }
    else if(e.keyCode == 83){
        eyeZ -= 5;
        lookZ -= 5;
    }
    else if(e.keyCode == 87) {
        eyeZ += 5;
        lookZ += 5;
    }
    else {
        return;
    }
    drawScene(gl, canvas);
  });

  // Create and set shaders
  let vShader = Program.createShader(gl, gl.VERTEX_SHADER, textureVertexShaderSource)
  let fShader = Program.createShader(gl, gl.FRAGMENT_SHADER, textureFragmentShaderSource)
  let textureProg = Program.createProgram(gl, vShader, fShader)
  checkIfExists(textureProg, "Texture program")
  gl.useProgram(textureProg)

  // Set and store uniform locations for texture shaders
  uniformNames[textureProg] = ["u_Resolution", "u_Image", "u_Kernel[0]", "u_KernelWeight", "u_FlipYPosition"]
  for(let u_var of uniformNames[textureProg]) {
    let uniformLocation = gl.getUniformLocation(textureProg, u_var)
    checkIfExists(uniformLocation, u_var)
    uniforms[u_var] = uniformLocation
  }

  // Set and store attribute locations for texture shaders
  let positionAttributeLocation = gl.getAttribLocation(textureProg, "a_Position")
  checkIfExists(positionAttributeLocation, "a_Position")
  attributes["a_Position"] = positionAttributeLocation

	let texCoordAttributeLocation = gl.getAttribLocation(textureProg, "a_TexCoord")
  checkIfExists(positionAttributeLocation, "a_TexCoord")
  attributes["a_TexCoord"] = texCoordAttributeLocation

  //------------------------------------------------------------
  // Create shader program for rectangle shaders
  let vShader2 = Program.createShader(gl, gl.VERTEX_SHADER, rectVertexShaderSource)
  let fShader2 = Program.createShader(gl, gl.FRAGMENT_SHADER, rectFragmentShaderSource)
  let rectProg = Program.createProgram(gl, vShader2, fShader2)
  checkIfExists(rectProg, "Rectangle program")
  gl.useProgram(rectProg)

  // Set and store uniform locations for rectangle shaders
  uniformNames[rectProg] = ["u_Color", "u_ViewMatrix", "u_ProjMatrix", "u_ModelMatrix"]
  for(let u_var of uniformNames[rectProg]) {
    let uniformLocation = gl.getUniformLocation(rectProg, u_var)
    checkIfExists(uniformLocation, u_var)
    uniforms[(u_var+"_rect")] = uniformLocation
  }
  
  // Set and store attribute locations for rectangle shaders
  let positionAttributeLocation2 = gl.getAttribLocation(rectProg, "a_Position")
  checkIfExists(positionAttributeLocation2, "a_Position")
  attributes["a_Position"+"_rect"] = positionAttributeLocation2

  objects.push(new Rect(rectProg, 50, 50, 200, 200))
  objects.push(new Rect(rectProg, 250, 50, 200, 200))
  objects.push(new Rect(rectProg, 50, 250, 200, 200))

  objects.push(new FShape(rectProg, 100, 100))
  drawScene(gl, canvas)
  /*
  //------------------------------------------------------------
  // Create image and render it
	let image = new Image()
  //objects.push(image)
	image.src = "./images/v2.png"

	image.onload = function() {
    gl.useProgram(textureProg)
    renderTexture(image, gl, canvas, textureProg)
    objects.push(new Rect())
    drawScene(gl, canvas, rectProg)
  }
  */
}

let width = 100
let height = 30
let color = [Math.random(), Math.random(), Math.random(), 1]

function drawScene(gl, canvas) {
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0,0,0,0)
  gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT)

  for(let renderObj of objects) {
    gl.useProgram(renderObj.shader)
    renderObj.render()

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
  
    let positionBuffer = gl.createBuffer()
    gl.enableVertexAttribArray(attributes["a_Position_rect"])
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  
    let size = 3
    let type = gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0
    gl.vertexAttribPointer(
      attributes["a_Position_rect"], size, type, normalize, stride, offset
    )

    gl.bufferData(gl.ARRAY_BUFFER, renderObj.vertices, gl.STATIC_DRAW)
    
    gl.uniformMatrix4fv(uniforms["u_ModelMatrix_rect"], false, renderObj.modelMatrix.elements)

    let viewMatrix = new Matrix4()
    viewMatrix.setLookAt(eyeX, eyeY, eyeZ, lookX, lookY, lookZ, 0, -1, 0)
    gl.uniformMatrix4fv(uniforms["u_ViewMatrix_rect"], false, viewMatrix.elements)

    let projMatrix = new Matrix4()
    //projMatrix.setOrtho(0, canvas.width, canvas.height, 0, 0.01, 1000)
    projMatrix.setPerspective(fov, canvas.width/canvas.height, 0.001, 1000);
    gl.uniformMatrix4fv(uniforms["u_ProjMatrix_rect"], false, projMatrix.elements)

    color = [Math.random(), Math.random(), Math.random(), 1]
    gl.uniform4fv(uniforms["u_Color_rect"], color)
  
    let primitiveType = gl.TRIANGLES
    offset = 0
    let count = (renderObj.vertices.length)/3
    gl.drawArrays(primitiveType, offset, count)
  }
  
}

//----------------------------------
// Run this code only
//----------------------------------
main()

//----------------------------------
// End of ran code
//----------------------------------

function randomInt(range) {
	return Math.floor(Math.random() * range)
}

function checkIfExists(obj, objName) {
  if(obj==null || obj < 0) {
    console.log(objName + " not found!")
  }
  else {
    //console.log(objName + " found successfully!")
  }
}
