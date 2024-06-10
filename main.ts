/* Koptelov Nikita, 10-1, 05.06.2024 */

// WASD
// Frame size change
// Set objects on scene

/* Imports */
import { writeFileSync } from "fs";
import { Timer } from "./timer";
import { Shader } from "./shader";
import { Buffer } from "./buffer";
import { Vec2, vec2Set, Vec3, vec3Set, Vec4, vec4Set, Mat4 } from "./mth";
import { UBO } from "./ubo";
import { Shape, Sphere, Plane, Torus } from "./shapes";
import { Scene } from "./scene";
import { UI } from "./ui";
import { Camera } from "./camera";
import { Input } from "./input";
import { Filer } from "./tools";

let gl: WebGL2RenderingContext;

/* Draw scene interface */
interface IDrawSceneData {
  shader: Shader;
  buffer: Buffer;
  ubos: UBO[];
}

/* Global scene data */
const globalShaderReloadTime = 100000000; // in seconds (one time in 3 years)
let globalBuffer: Buffer;
let globalShader: Shader;

let globalScene: Scene;
let globalTimer = new Timer();
let globalCamera: Camera;

/* Scene UBO:
 * vec4 sync;
 * ---- offset: 4
 * vec4 camLocFrameW;
 * vec4 camDirFrameH;
 * vec4 camAtProjDist;
 * vec4 camRightWp;
 * vec4 camUpHp;
 * ---- +24 floats ---> 96 bytes
 * mat4 matrView;
 * mat4 matrProj;
 * mat4 matrVP;
 * ---- +48 floats ---> 192 bytes
 * ---- offset: 48 + 24 = 72, 288 bytes
 * ShapeData shapeData[64];
 * ---- +64 * Shape.sizeInBytes
 */
let globalTimerUBO: UBO;
let globalTimerUBOBuf: Array<number>;

let globalInput = new Input();

function initializeGL(): void {
  const canvas = document.querySelector(
    "#glCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return;

  let ctx = canvas.getContext("webgl2");
  if (!ctx) return;

  gl = ctx;

  globalCamera = new Camera(canvas.width, canvas.height);
  globalCamera.set(vec3Set(0, 1, -5), vec3Set(0), vec3Set(0, 1, 0));
}

function drawScene(): void {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, globalBuffer.bufferID);
  gl.vertexAttribPointer(
    gl.getAttribLocation(globalShader.shaderProgram, "inPos"),
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(
    gl.getAttribLocation(globalShader.shaderProgram, "inPos")
  );

  globalShader.use();

  /* UBO update & apply */
  globalTimerUBOBuf[0] = globalTimer.global.time;
  globalTimerUBOBuf[1] = globalTimer.global.globalTime;
  globalTimerUBOBuf[2] = globalTimer.global.deltaTime;
  globalTimerUBOBuf[3] = globalTimer.global.globalDeltaTime;
  globalTimerUBO.update(new Float32Array(globalTimerUBOBuf));
  globalTimerUBO.apply();

  globalScene.cameraUpdate();
  globalScene.cameraUBO.apply();

  globalScene.shapesUBO.apply();

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

export async function main() {
  initializeGL();
  UI.initialize();

  globalShader = new Shader(gl, "main_shader");
  await globalShader.load();

  globalScene = new Scene(gl, globalShader, globalCamera);

  let sphereDefault = new Sphere(
    new Vec3(0, 1, 0),
    1.0,
    Shape.materialLib["red"]
  );

  let planeDefault = new Plane(
    new Vec3(0, 0, 0),
    new Vec3(0, 1, 0),
    Shape.materialLib["blue"]
  );

  let torusDefault = new Torus(
    new Vec3(1, 0.2, -2),
    0.5,
    0.2,
    Shape.materialLib["green"]
  );

  UI.bindScene(globalScene);

  UI.addShapeToScene(sphereDefault);
  UI.addShapeToScene(planeDefault);
  UI.addShapeToScene(torusDefault);

  UI.saveSceneToLocalStorage("default");

  /*
  UI.addShapeToScene(
    new Sphere(new Vec3(6, 1, 6), 1, Shape.materialLib["green"])
  );

  UI.addShapeToScene(
    new Sphere(new Vec3(8, 1, 8), 1, Shape.materialLib["green"])
  );

  UI.addShapeToScene(
    new Sphere(new Vec3(10, 1, 10), 1, Shape.materialLib["green"])
  );

  UI.addShapeToScene(
    new Sphere(new Vec3(12, 1, 12), 1, Shape.materialLib["green"])
  );
  */

  gl.clearColor(131 / 255, 77 / 255, 24 / 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /* Prepare ray marching scene resources */
  globalBuffer = new Buffer(gl);
  globalBuffer.bindData(
    [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0],
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW
  );

  globalTimerUBO = new UBO(gl, 16, "timerUBO", globalShader);
  globalTimerUBOBuf = new Array<number>(4);

  for (let i = 0; i < globalTimerUBOBuf.length; i++) {
    globalTimerUBOBuf[i] = 0;
  }

  let shaderReloadTime = 0;

  const draw = async () => {
    globalTimer.response();
    document.dispatchEvent(new Event("keydown"));
    inputHandle();

    if (shaderReloadTime > globalShaderReloadTime * 1000) {
      shaderReloadTime = 0;
      await globalShader.load();
    }

    shaderReloadTime += globalTimer.global.globalDeltaTime;
    drawScene();
    window.requestAnimationFrame(draw);
  };

  draw();
}

window.addEventListener("load", () => {
  // writeFileSync("a.txt", "123");
  main();
});

window.addEventListener("wheel", (event) => {
  let dir = globalCamera.loc.normalize();
  globalCamera.loc = globalCamera.loc.add(
    dir.mul(
      ((globalTimer.global.globalDeltaTime / 1000.0) *
        event.deltaY *
        globalCamera.loc.len()) /
        20.0
    )
  );
  globalCamera.set(globalCamera.loc, new Vec3(0), new Vec3(0, 1, 0));
});

function inputHandle() {
  let dir = new Vec3(0, 0, 1);

  dir = dir.pointTransform(Mat4.rotateY(globalCamera.angleY));

  globalCamera.dir = dir;

  if (globalInput.checkKeys("d")) {
    globalCamera.angleY += (globalTimer.global.globalDeltaTime / 777.0) * 50;
  }
  if (globalInput.checkKeys("a")) {
    globalCamera.angleY -= (globalTimer.global.globalDeltaTime / 777.0) * 50;
  }

  if (globalInput.checkKeys("ArrowUp")) {
    globalCamera.angleXZ += (globalTimer.global.globalDeltaTime / 777.0) * 50;
  }
  if (globalInput.checkKeys("ArrowDown")) {
    globalCamera.angleXZ -= (globalTimer.global.globalDeltaTime / 777.0) * 50;
  }

  if (globalInput.checkKeys("w")) {
    globalCamera.loc = globalCamera.loc.add(
      dir.mul(
        globalTimer.global.globalDeltaTime / 333.0
        // Number(globalInput.checkKeys("Shift")) * 0.2
      )
    );
  }

  if (globalInput.checkKeys("s")) {
    globalCamera.loc = globalCamera.loc.add(
      dir.mul(
        -globalTimer.global.globalDeltaTime / 333.0
        // Number(globalInput.checkKeys("Shift")) * 0.2
      )
    );
  }
}
