/* Koptelov Nikita, 10-1, 05.06.2024 */

export class Buffer {
  bufferID: WebGLBuffer | null;
  gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.bufferID = this.gl.createBuffer();
  }

  bindData(arr: any, bufferType: number, drawType: number) {
    this.gl.bindBuffer(bufferType, this.bufferID);
    this.gl.bufferData(bufferType, new Float32Array(arr), drawType);
  }
}
