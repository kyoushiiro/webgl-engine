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

function main() {
  // Set up WebGL 2
  canvas = document.getElementById("canv")
  canvas.width = 500
  canvas.height = 500
  gl = canvas.getContext("webgl2")
  checkIfExists(gl, "WebGL2 context")

  // Create and set shaders
  let vShader = createShader(gl, gl.VERTEX_SHADER, textureVertexShaderSource)
  let fShader = createShader(gl, gl.FRAGMENT_SHADER, textureFragmentShaderSource)
  let textureProg = createProgram(gl, vShader, fShader)
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
  let vShader2 = createShader(gl, gl.VERTEX_SHADER, rectVertexShaderSource)
  let fShader2 = createShader(gl, gl.FRAGMENT_SHADER, rectFragmentShaderSource)
  let rectProg = createProgram(gl, vShader2, fShader2)
  checkIfExists(rectProg, "Rectangle program")
  gl.useProgram(rectProg)

  // Set and store uniform locations for rectangle shaders
  uniformNames[rectProg] = ["u_Color", "u_ViewMatrix", "u_ProjMatrix"]
  for(let u_var of uniformNames[rectProg]) {
    let uniformLocation = gl.getUniformLocation(rectProg, u_var)
    checkIfExists(uniformLocation, u_var)
    uniforms[(u_var+"_rect")] = uniformLocation
  }
  
  // Set and store attribute locations for rectangle shaders
  let positionAttributeLocation2 = gl.getAttribLocation(rectProg, "a_Position")
  checkIfExists(positionAttributeLocation2, "a_Position")
  attributes["a_Position"+"_rect"] = positionAttributeLocation2

  objects.push(new Rect(null, rectProg, 50, 50, 200, 200))
  objects.push(new Rect(null, rectProg, 250, 50, 200, 200))
  objects.push(new Rect(null, rectProg, 50, 250, 200, 200))
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

let translation = [0, 0]
let width = 100
let height = 30
let color = [Math.random(), Math.random(), Math.random(), 1]

function drawScene(gl, canvas) {
  //gl.viewport(0, 0, canvas.width, canvas.height)
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

    let viewMatrix = new Matrix4()
    viewMatrix.setLookAt(0, 0, 0.2, 0, 0, 0, 0, 1, 0)
    gl.uniformMatrix4fv(uniforms["u_ViewMatrix_rect"], false, viewMatrix.elements)

    let projMatrix = new Matrix4()
    projMatrix.setOrtho(0, 500, 500, 0, 0.001, 1000)
    gl.uniformMatrix4fv(uniforms["u_ProjMatrix_rect"], false, projMatrix.elements)

    color = [Math.random(), Math.random(), Math.random(), 1]
    gl.uniform4fv(uniforms["u_Color_rect"], color)
  
    let primitiveType = gl.TRIANGLES
    offset = 0
    let count = 6
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
