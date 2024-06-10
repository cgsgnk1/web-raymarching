/* Koptelov Nikita, 10-1, 05.06.2024 */

import { Shape } from "./shapes";
import { IArrayChanger } from "./tools";
import { UBO } from "./ubo";
import { Shader } from "./shader";
import { Camera } from "./camera";

export class Scene {
  globalShapes: Array<Shape>;
  camera: Camera;

  shapesUBO: UBO;
  cameraUBO: UBO;

  shapesUBOArray: number[];
  cameraUBOArray: number[];

  static maxShapes: number = 64;
  amountOfShapes: number = 0;

  constructor(gl: WebGL2RenderingContext, shader: Shader, camera: Camera) {
    this.globalShapes = [];
    this.shapesUBO = new UBO(
      gl,
      Scene.maxShapes * Shape.sizeInBytes,
      "shapesUBO",
      shader
    );
    this.shapesUBOArray = new Array<number>(
      (Scene.maxShapes * Shape.sizeInBytes) / 4
    );

    this.cameraUBO = new UBO(gl, Camera.sizeinBytes, "cameraUBO", shader);
    this.cameraUBOArray = new Array<number>(Camera.sizeinBytes / 4);

    for (let i = 0; i < this.cameraUBOArray.length; i++) {
      this.shapesUBOArray[i] = 0;
    }
    this.camera = camera;
    this.#cameraToArray({ arr: this.cameraUBOArray }, 0);
  }

  add(shape: any): void {
    let i = this.amountOfShapes;

    this.globalShapes[i] = shape;
    this.globalShapes[i].index = i;

    this.amountOfShapes++;

    this.shapesUpdate();
  }

  edit(shape: any, index: number): void {
    this.globalShapes[index] = shape;
    this.globalShapes[index].index = index;

    this.shapesUpdate();
  }

  remove(index: number): void {
    if (index > this.amountOfShapes - 1) {
      return;
    }

    this.globalShapes[index] = new Shape(0, []);
    for (let i = index + 1; i < this.amountOfShapes; i++) {
      this.globalShapes[i - 1] = this.globalShapes[i];
    }
    this.globalShapes.pop();
    this.amountOfShapes--;

    this.shapesUpdate();
  }

  shapesUpdate(): void {
    this.#shapesToArray(
      { arr: this.shapesUBOArray },
      0,
      this.shapesUBOArray.length
    );
    this.shapesUBO.update(new Float32Array(this.shapesUBOArray));
  }

  cameraUpdate(): void {
    this.#cameraToArray({ arr: this.cameraUBOArray }, 0);
    this.cameraUBO.update(new Float32Array(this.cameraUBOArray));
  }

  #shapesToArray(change: IArrayChanger, offset: number, end: number): void {
    let k = 0;

    this.globalShapes.forEach((element) => {
      for (let i = 0; i < Shape.sizeInBytes / 4; i++) {
        change.arr[offset + k] = element.data[i];
        k++;
      }
    });

    for (; offset + k < end; k++) {
      change.arr[offset + k] = 0;
    }
  }

  #cameraToArray(change: IArrayChanger, offset: number): void {
    this.camera.toArray(change, offset);
  }
}
