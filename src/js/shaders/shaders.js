let textureVertexShaderSource = `#version 300 es
	in vec2 a_Position;
	in vec2 a_TexCoord;
  uniform vec2 u_Resolution;  
  uniform float u_FlipYPosition;

  out vec2 v_TexCoord;

	void main() {
		// TODO: put these calculations on one line
		// Convert position from pixels to 0.0 - 1.0
		vec2 zeroToOne = a_Position / u_Resolution;
		// Convert fro 0->1 to 0->2
		vec2 zeroToTwo = zeroToOne * 2.0;
		// Convert from 0->2 to -1->+1 (clip space)
		vec2 clipSpace = zeroToTwo - 1.0;

		gl_Position = vec4(clipSpace * vec2(1, u_FlipYPosition), 0, 1);
		v_TexCoord = a_TexCoord;
	}
`;

let textureFragmentShaderSource = `#version 300 es
  precision mediump float;
  
  uniform float u_Kernel[9];
  uniform float u_KernelWeight;
	
	in vec2 v_TexCoord;
	uniform sampler2D u_Image;

	out vec4 outColor;

	void main() {
    vec2 onePixel = vec2(1) / vec2(textureSize(u_Image, 0));

    vec4 colorSum =
      texture(u_Image, v_TexCoord + onePixel * vec2(-1, -1)) * u_Kernel[0] +
      texture(u_Image, v_TexCoord + onePixel * vec2( 0, -1)) * u_Kernel[1] +
      texture(u_Image, v_TexCoord + onePixel * vec2( 1, -1)) * u_Kernel[2] +
      texture(u_Image, v_TexCoord + onePixel * vec2(-1,  0)) * u_Kernel[3] +
      texture(u_Image, v_TexCoord + onePixel * vec2( 0,  0)) * u_Kernel[4] +
      texture(u_Image, v_TexCoord + onePixel * vec2( 1,  0)) * u_Kernel[5] +
      texture(u_Image, v_TexCoord + onePixel * vec2(-1,  1)) * u_Kernel[6] +
      texture(u_Image, v_TexCoord + onePixel * vec2( 0,  1)) * u_Kernel[7] +
      texture(u_Image, v_TexCoord + onePixel * vec2( 1,  1)) * u_Kernel[8] ;

    outColor = vec4((colorSum / u_KernelWeight).rgb, 1); 
	}
`;

const BASE_VERTEX_SOURCE = `#version 300 es
  in vec4 a_Position;
  in vec4 a_Color;
  in vec4 a_Normal;

  out vec4 v_Color;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  uniform vec3 u_LightColor; // Light color
  uniform vec3 u_LightDir; // World coordinate, normalized

  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal));
    float nDotL = max(dot(u_LightDir, normal), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;

    v_Color = vec4(diffuse, a_Color.a);
  }
`;

const BASE_FRAGMENT_SOURCE = `#version 300 es
  precision mediump float;
  
  uniform vec4 u_Color;
  in vec4 v_Color;

  out vec4 outColor;

  void main() {
    outColor =  v_Color;
  }
`;

export {
  textureVertexShaderSource,
  textureFragmentShaderSource,
  BASE_VERTEX_SOURCE,
  BASE_FRAGMENT_SOURCE,
};
