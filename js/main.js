let vertexShaderSource = `#version 300 es
	in vec2 a_Position;
	uniform vec2 u_Resolution;  

	void main() {
		// TODO: put these calculations on one line
		// Convert position from pixels to 0.0 - 1.0
		vec2 zeroToOne = a_Position / u_Resolution;
		// Convert fro 0->1 to 0->2
		vec2 zeroToTwo = zeroToOne * 2.0;
		// Convert from 0->2 to -1->+1 (clip space)
		vec2 clipSpace = zeroToTwo - 1.0;

		gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
	}
`;

let fragmentShaderSource = `#version 300 es
	precision mediump float;
	uniform vec4 u_Color;
	out vec4 outColor;

	void main() {
		outColor = u_Color;
	}
`;

function createShader(gl, type, source) {
	let shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (success) {
		return shader
	}

	console.log(gl.getShaderInfoLog(shader))
	gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
	let program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	let success = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (success) {
		return program
	}

	console.log(gl.getProgramInfoLog(program))
	gl.deleteProgram(program)
}

function main() {
	let canvas = document.getElementById("canv")
	canvas.width = 600;
	canvas.height = 600;
	let gl = canvas.getContext("webgl2")
	if (!gl) {
		console.log("WebGL2 context not found!")
	}

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
	let program = createProgram(gl, vertexShader, fragmentShader)

	let resolutionUniformLocation = gl.getUniformLocation(program, "u_Resolution")
	let colorLocation = gl.getUniformLocation(program, "u_Color")

	let positionAttributeLocation = gl.getAttribLocation(program, "a_Position")
	let positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

	let positions = [
		10, 20,
		80, 20,
		10, 30,
		10, 30,
		80, 20,
		80, 30
	]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

	let vao = gl.createVertexArray()
	gl.bindVertexArray(vao)
	gl.enableVertexAttribArray(positionAttributeLocation)

	let size = 2
	let type = gl.FLOAT
	let normalize = false
	let stride = 0
	let offset = 0
  gl.vertexAttribPointer(
		positionAttributeLocation, size, type, normalize, stride, offset
	)

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	gl.clearColor(0, 0, 0, 0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	gl.useProgram(program)
	gl.bindVertexArray(vao)
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

	for(let ii = 0; ii < 50; ++ii) {
		setRectangle(
			gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300)
		)

		gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1)

		let primitiveType = gl.TRIANGLES
		let offset = 0
		let count = 6
		gl.drawArrays(primitiveType, offset, count)
	}
}

main()

function randomInt(range) {
	return Math.floor(Math.random() * range)
}

function setRectangle(gl, x, y, width, height) {
	let x1 = x
	let x2 = x + width
	let y1 = y
	let y2 = y + height

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2
	]), gl.STATIC_DRAW)
}