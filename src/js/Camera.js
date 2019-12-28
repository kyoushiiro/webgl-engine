import { Vector3, Matrix4 } from './Matrix4.js';

export class Camera {
  constructor(eyeX, eyeY, eyeZ, pitch, yaw, aspect = 1.0, fov = 60) {
    this.eye = new Vector3([eyeX, eyeY, eyeZ]);
    // Used for "lookAt" matrix vs FPS style
    // this.target = new Vector3([lookX, lookY, lookZ]);

    // prettier-ignore
    // this.viewMatrix = new Matrix4().setLookAt(
    //     eyeX, eyeY, eyeZ,
    //     lookX, lookY, lookZ,
    //     0, 1, 0
    // );

    this.viewMatrix = new Matrix4().setFPSLookAt(eyeX, eyeY, eyeZ, 0.0, 0.0);
    this.projMatrix = new Matrix4().setPerspective(fov, aspect, 0.001, 2000);
  }

  getViewMatrix() {
    return this.viewMatrix;
  }

  getProjMatrix() {
    return this.projMatrix;
  }

  moveEyeForward(speed) {
    let z = -Math.cos(this.yaw) * speed;
    let x = -Math.sin(this.yaw) * speed;
    let y = Math.sin(this.pitch) * speed;
    this.eye.elements[2] += z;
    this.eye.elements[1] += y;
    this.eye.elements[0] += x;

    this.eye.elements[1] =
      this.eye.elements[1] < 0.1 ? 0.1 : this.eye.elements[1];
  }

  moveEyeRight(speed) {
    let x = Math.cos(this.yaw) * speed;
    let z = -Math.sin(this.yaw) * speed;
    this.eye.elements[0] += x;
    this.eye.elements[2] += z;
  }

  updateEye(eyeX, eyeY, eyeZ) {
    this.viewMatrix.setLookAt(
      eyeX,
      eyeY,
      eyeZ,
      eyeX,
      eyeY,
      eyeZ - 500,
      0,
      1,
      0
    );
  }

  updateFPSView(pitch, yaw) {
    this.viewMatrix.setFPSLookAt(
      this.eye.elements[0],
      this.eye.elements[1],
      this.eye.elements[2],
      pitch,
      yaw
    );
    this.pitch = pitch;
    this.yaw = yaw;
  }
}
