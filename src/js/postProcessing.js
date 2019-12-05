function renderTexture(image, gl, canvas, program) {
  canvas.width = image.width;
  canvas.height = image.height;

	let vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

	let positionBuffer = gl.createBuffer()
	gl.enableVertexAttribArray(attributes["a_Position"])
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

	let size = 2
	let type = gl.FLOAT
	let normalize = false
	let stride = 0
	let offset = 0
  gl.vertexAttribPointer(
		attributes["a_Position"], size, type, normalize, stride, offset
	)

	let texCoordBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0
	]), gl.STATIC_DRAW)
	gl.enableVertexAttribArray(attributes["a_TexCoord"])
	
	size = 2
	type = gl.FLOAT
	normalize = false
	stride = 0
	offset = 0
	gl.vertexAttribPointer(
		attributes["a_TexCoord"], size, type, normalize, stride, offset
  )
  
  let originalImageTexture = createAndSetupTexture(gl)

	let mipLevel = 0
	let internalFormat = gl.RGBA
	let srcFormat = gl.RGBA
	let srcType = gl.UNSIGNED_BYTE
	gl.texImage2D(
		gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image
  )
  
  let textures = []
  let framebuffers = []
  for(let ii = 0; ii < 2; ++ii) {
    let texture = createAndSetupTexture(gl)
    textures.push(texture)

    mipLevel = 0
    internalFormat = gl.RGBA
    let border = 0
    srcFormat = gl.RGBA
    srcType = gl.UNSIGNED_BYTE
    let data = null
    gl.texImage2D(
      gl.TEXTURE_2D, mipLevel, internalFormat, image.width, image.height, border,
      srcFormat, srcType, data
    )

    let fbo = gl.createFramebuffer()
    framebuffers.push(fbo)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

    let attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, mipLevel
    )
  }

  let kernels = {
    normal: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0
    ],
    gaussianBlur: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045
    ],
    unsharpen: [
      -1, -1, -1,
      -1,  9, -1,
      -1, -1, -1
    ],
    emboss: [
      -2, -1,  0,
      -1,  1,  1,
       0,  1,  2
    ]
  }

  let effectsToApply = [
    "gaussianBlur",
    "emboss",
    "gaussianBlur",
    "unsharpen",
  ]
  
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  setRectangle(gl, 0, 0, image.width, image.height)
  
  drawEffects()

  function drawEffects() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.useProgram(program)
    gl.bindVertexArray(vao)

    gl.activeTexture(gl.TEXTURE0 + 0)
    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture)

    gl.uniform1i(uniforms["u_Image"], 0)
    gl.uniform1f(uniforms["u_FlipYPosition"], 1)

    let count = 0
    for(let ii = 0; ii < effectsToApply.length; ++ii) {
      setFrameBuffer(framebuffers[count % 2], image.width, image.height)
      drawWithKernel(effectsToApply[ii])
      gl.bindTexture(gl.TEXTURE_2D, textures[count % 2])
      ++count 
    }
    
    gl.uniform1f(uniforms["u_FlipYPosition"], -1)

    setFrameBuffer(null, gl.canvas.width, gl.canvas.height)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    drawWithKernel("normal")

  }

  function setFrameBuffer(fbo, width, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.uniform2f(uniforms["u_Resolution"], width, height)
    gl.viewport(0, 0, width, height)
  }

  function drawWithKernel(name) {
    gl.uniform1fv(uniforms["u_Kernel[0]"], kernels[name])

    gl.uniform1f(uniforms["u_KernelWeight"], computeKernelWeight(kernels[name]))

    let primitiveType = gl.TRIANGLES
    let offset = 0
    let count = 6
    gl.drawArrays(primitiveType, offset, count)
  }

}

function computeKernelWeight(kernel) {
  let weight = kernel.reduce(function(prev, curr) {
    return prev + curr
  })
  return weight <= 0 ? 1 : weight
}