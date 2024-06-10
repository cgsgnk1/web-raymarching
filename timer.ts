/* Koptelov Nikita, 10-1, 05.06.2024 */

export class Timer {
  startTime: number;
  oldTime: number;
  oldTimeFPS: number;
  pauseTime: number;
  frameCounter: number;
  global: {
    fps: number;
    globalTime: number;
    globalDeltaTime: number;
    time: number;
    deltaTime: number;
    isPause: boolean;
  };

  constructor() {
    this.startTime = this.oldTime = this.oldTimeFPS = Date.now();
    this.pauseTime = this.frameCounter = 0;
    this.global = {
      fps: 0,
      globalTime: 0,
      globalDeltaTime: 0,
      time: 0,
      deltaTime: 0,
      isPause: false,
    };
  }

  response() {
    const t = Date.now();

    this.global.globalTime = t - this.startTime;
    this.global.globalDeltaTime = t - this.oldTime;
    if (this.global.isPause) {
      this.global.deltaTime = 0;
      this.pauseTime += t - this.oldTime;
    } else {
      this.global.deltaTime = this.global.globalDeltaTime;
      this.global.time = t - this.pauseTime - this.startTime;
    }

    this.frameCounter++;

    if (t - this.oldTimeFPS > 300) {
      this.global.fps = this.frameCounter / ((t - this.oldTimeFPS) / 1000.0);
      this.oldTimeFPS = t;
      this.frameCounter = 0;

      let fps = document.getElementById("fps");
      if (fps) {
        fps.innerText = "NK1 Ray Marching; FPS: " + this.global.fps.toString();
      }
    }
    this.oldTime = t;
  }
}
