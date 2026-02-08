const MAX_CONTEXTS = 10;
const MOBILE_MAX_CONTEXTS = 5;

interface PooledContext {
  canvas: OffscreenCanvas;
  gl: WebGL2RenderingContext;
  inUse: boolean;
  lastUsed: number;
}

class ContextPool {
  private pool: PooledContext[] = [];
  private maxContexts: number;

  constructor() {
    this.maxContexts =
      typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent)
        ? MOBILE_MAX_CONTEXTS
        : MAX_CONTEXTS;
  }

  acquire(): { canvas: OffscreenCanvas; gl: WebGL2RenderingContext } | null {
    const available = this.pool.find((ctx) => !ctx.inUse);
    if (available) {
      available.inUse = true;
      available.lastUsed = performance.now();
      return { canvas: available.canvas, gl: available.gl };
    }

    if (this.pool.length < this.maxContexts) {
      return this.createContext();
    }

    return this.evictAndCreate();
  }

  release(gl: WebGL2RenderingContext) {
    const entry = this.pool.find((ctx) => ctx.gl === gl);
    if (entry) {
      entry.inUse = false;
      entry.lastUsed = performance.now();
    }
  }

  private createContext(): {
    canvas: OffscreenCanvas;
    gl: WebGL2RenderingContext;
  } | null {
    const canvas = new OffscreenCanvas(512, 512);
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) return null;

    const entry: PooledContext = {
      canvas,
      gl,
      inUse: true,
      lastUsed: performance.now(),
    };

    this.pool.push(entry);
    return { canvas, gl };
  }

  private evictAndCreate(): {
    canvas: OffscreenCanvas;
    gl: WebGL2RenderingContext;
  } | null {
    const lru = this.pool
      .filter((ctx) => !ctx.inUse)
      .sort((a, b) => a.lastUsed - b.lastUsed)[0];

    if (!lru) return null;

    const index = this.pool.indexOf(lru);
    const ext = lru.gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();

    this.pool.splice(index, 1);
    return this.createContext();
  }
}

let instance: ContextPool | null = null;

export function getContextPool(): ContextPool {
  if (!instance) {
    instance = new ContextPool();
  }
  return instance;
}
