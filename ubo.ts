/* Koptelov Nikita, 10-1, 05.06.2024 */

import { Buffer } from "./buffer";
import { Shader } from "./shader";

export class UBO {
  buffer: Buffer;
  size: number;
  binding: number;

  gl: WebGL2RenderingContext;

  constructor(
    gl: WebGL2RenderingContext,
    size: number,
    binding: string,
    shader: Shader
  ) {
    this.gl = gl;
    this.size = size;

    let index = gl.getUniformBlockIndex(shader.shaderProgram, binding);
    gl.uniformBlockBinding(shader.shaderProgram, index, shader.numOfUBOs);
    this.binding = shader.numOfUBOs;
    shader.numOfUBOs++;

    this.buffer = new Buffer(gl);
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer.bufferID);
    gl.bufferData(gl.UNIFORM_BUFFER, size, gl.STATIC_DRAW);
    gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
  }

  update(arr: Float32Array): void {
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer.bufferID);
    this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, 0, arr);
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
  }

  apply(): void {
    this.gl.bindBufferBase(
      this.gl.UNIFORM_BUFFER,
      this.binding,
      this.buffer.bufferID
    );
  }

  resize(size: number): void {
    this.size = size;

    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer.bufferID);
    this.gl.bufferData(this.gl.UNIFORM_BUFFER, this.size, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
  }
}
