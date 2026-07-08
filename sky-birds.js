// ========================================
// SKY BIRDS ANIMATION — Monet edition
// Impressionist painted sky in layered
// brushstrokes, drifting brushy clouds,
// and white birds gliding through.
// Day: Water Lilies blues/greens/lavender.
// Dark mode: Impression, Sunrise.
// ========================================

(function() {
  'use strict';

  // --- Seeded PRNG ---
  function seededRNG(seed) {
    let s = seed | 0;
    return () => {
      s = (Math.imul((s = s + 0x6d2b79f5 | 0) ^ s >>> 15, 1 | s));
      return (((s = s + Math.imul(s ^ s >>> 7, 61 | s) ^ s) ^ s >>> 14) >>> 0) / 0x100000000;
    };
  }

  // --- Fractal Noise (for the organic edge) ---
  function hashNoise(x, y) {
    let n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function smoothNoise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = hashNoise(ix, iy);
    const b = hashNoise(ix + 1, iy);
    const c = hashNoise(ix, iy + 1);
    const d = hashNoise(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }

  function fractalNoise(x, y, octaves) {
    octaves = octaves || 4;
    let val = 0, amp = 1, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      val += smoothNoise(x * freq, y * freq) * amp;
      max += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val / max;
  }

  // --- Color Helpers ---
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const lerpColor = (a, b, t) => ({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t
  });
  const rgba = (c, a) => `rgba(${clamp(c.r)},${clamp(c.g)},${clamp(c.b)},${a.toFixed(3)})`;

  // --- Monet Palettes ---
  // Day: Water Lilies — deep blues, blue-greens, lavender, pink accents
  const SKY_DAY = {
    base: [
      { r: 20, g: 60,  b: 110 },
      { r: 32, g: 84,  b: 128 },
      { r: 46, g: 104, b: 136 },
      { r: 70, g: 122, b: 148 }
    ],
    accents: [
      { c: { r: 126, g: 120, b: 170 }, p: 0.07 },  // lavender
      { c: { r: 56,  g: 106, b: 92  }, p: 0.07 },  // lily-pad green
      { c: { r: 208, g: 152, b: 170 }, p: 0.03 },  // pink blossom
      { c: { r: 132, g: 164, b: 192 }, p: 0.07 }   // pale light
    ],
    sun: false,
    seed: 137
  };

  // Dusk: Impression, Sunrise — smoky blue-violet haze, glowing orange
  const SKY_DUSK = {
    base: [
      { r: 56,  g: 62,  b: 88  },
      { r: 76,  g: 80,  b: 104 },
      { r: 102, g: 94,  b: 106 },
      { r: 136, g: 104, b: 94  }
    ],
    accents: [
      { c: { r: 222, g: 118, b: 58  }, p: 0.045 }, // sunrise orange
      { c: { r: 88,  g: 104, b: 116 }, p: 0.07 },  // teal-grey mist
      { c: { r: 212, g: 158, b: 122 }, p: 0.05 },  // peach haze
      { c: { r: 96,  g: 86,  b: 124 }, p: 0.06 }   // violet
    ],
    sun: true,
    seed: 911
  };

  const CLOUD_DAY = {
    main: [{ r: 250, g: 248, b: 243 }, { r: 234, g: 231, b: 224 }],
    shadow: { r: 150, g: 148, b: 178 },
    accent: { r: 214, g: 170, b: 182 }
  };
  const CLOUD_DUSK = {
    main: [{ r: 246, g: 224, b: 196 }, { r: 230, g: 202, b: 174 }],
    shadow: { r: 124, g: 98, b: 114 },
    accent: { r: 236, g: 164, b: 104 }
  };

  function isDusk() {
    return document.body.classList.contains('theme-dark');
  }

  // --- State ---
  let skyCanvas, cloudCanvas, container, skyInner;
  let skyCtx, cloudCtx;
  let width = 0, height = 0;
  let dpr = 1;
  let birds = [];
  let clouds = [];
  let time = 0;
  let animId = null;

  const MAX_BIRDS = 12;

  // --- Organic Edge Mask ---
  // Computed once per size; the painting is masked through it so the
  // canvas dissolves into the page like an unframed sketch.
  let edgeMask = null;
  let texW = 0, texH = 0, texTheme = null;
  let skyTexture = null;
  let texCache = {};

  function generateEdgeMask(w, h) {
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);

    const canvas = document.createElement('canvas');
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(pw, ph);
    const d = imgData.data;

    const edgeMargin = 0.005 * Math.min(pw, ph);
    const cx = pw / 2, cy = ph / 2;
    const hw = cx - edgeMargin, hh = cy - edgeMargin;
    const cornerR = 0.28 * Math.min(hw, hh);
    const edgeNoise = 0.06 * Math.min(pw, ph) * 0.55;
    const fadeZone = 0.12 * Math.min(pw, ph);

    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const idx = (y * pw + x) * 4;

        const ox = Math.abs(x - cx) - (hw - cornerR);
        const oy = Math.abs(y - cy) - (hh - cornerR);
        let sdf = Math.sqrt(Math.max(ox, 0) ** 2 + Math.max(oy, 0) ** 2) +
                  Math.min(Math.max(ox, oy), 0) - cornerR;

        sdf += (2 * fractalNoise(0.8 * x, 0.8 * y, 3) - 1) * edgeNoise;
        sdf += (2 * fractalNoise(2.5 * x, 2.5 * y + 500, 3) - 1) * edgeNoise * 0.35;
        sdf += (2 * fractalNoise(6 * x, 6 * y + 1000, 2) - 1) * edgeNoise * 0.12;

        if (sdf > 0) continue;

        let alpha = 255;
        if (-sdf < fadeZone) {
          const e = -sdf / fadeZone;
          alpha = 255 * e * e * (3 - 2 * e);
        }

        d[idx] = 255;
        d[idx + 1] = 255;
        d[idx + 2] = 255;
        d[idx + 3] = clamp(alpha);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // --- Brushstrokes ---
  function drawStroke(ctx, rng, x, y, angle, len, w, fillStyle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = fillStyle;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    const bend = (rng() - 0.5) * len * 0.4;
    ctx.beginPath();
    ctx.moveTo(-len / 2, 0);
    ctx.quadraticCurveTo(0, bend, len / 2, 0);
    ctx.stroke();
    ctx.restore();
  }

  // --- Impressionist Painting ---
  // A low-res "reference" underpainting provides coherent drifting color
  // masses; strokes sample their color from it and follow a smooth flow
  // field, so neighboring dabs agree in hue and direction the way
  // wet-on-wet brushwork does.
  function buildRefField(pal, pw, ph, rng) {
    const rw = Math.max(4, Math.round(pw / 8));
    const rh = Math.max(4, Math.round(ph / 8));
    const canvas = document.createElement('canvas');
    canvas.width = rw;
    canvas.height = rh;
    const ctx = canvas.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, 0, rh);
    pal.base.forEach((c, i) => g.addColorStop(i / (pal.base.length - 1), rgba(c, 1)));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rw, rh);

    // Drifting accent masses
    for (const a of pal.accents) {
      const blobs = 2 + Math.floor(rng() * 3);
      for (let i = 0; i < blobs; i++) {
        const bx = rng() * rw, by = rng() * rh;
        const br = (0.14 + 0.30 * rng()) * rw;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        grad.addColorStop(0, rgba(a.c, 0.10 + 1.6 * a.p));
        grad.addColorStop(1, rgba(a.c, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(bx - br, by - br, br * 2, br * 2);
      }
    }

    // Tonal drifts: lighter and darker passages through the sky
    for (let i = 0; i < 4; i++) {
      const bx = rng() * rw, by = rng() * rh;
      const br = (0.16 + 0.30 * rng()) * rw;
      const tone = rng() > 0.5 ? '255,255,255' : '0,0,20';
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0, 'rgba(' + tone + ',0.07)');
      grad.addColorStop(1, 'rgba(' + tone + ',0)');
      ctx.fillStyle = grad;
      ctx.fillRect(bx - br, by - br, br * 2, br * 2);
    }

    // Warm halo where the sun will sit, so surrounding strokes glow
    if (pal.sun) {
      const sx = 0.66 * rw, sy = 0.36 * rh;
      const br = 0.4 * rw;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, br);
      grad.addColorStop(0, 'rgba(226,130,62,0.55)');
      grad.addColorStop(0.4, 'rgba(210,120,80,0.25)');
      grad.addColorStop(1, 'rgba(210,120,80,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sx - br, sy - br, br * 2, br * 2);
    }

    return {
      canvas,
      data: ctx.getImageData(0, 0, rw, rh).data,
      rw, rh,
      sx: rw / pw,
      sy: rh / ph
    };
  }

  function sampleRef(ref, x, y) {
    const ix = Math.max(0, Math.min(ref.rw - 1, Math.round(x * ref.sx)));
    const iy = Math.max(0, Math.min(ref.rh - 1, Math.round(y * ref.sy)));
    const i = (iy * ref.rw + ix) * 4;
    return { r: ref.data[i], g: ref.data[i + 1], b: ref.data[i + 2] };
  }

  // Smoothly varying stroke direction, biased horizontal
  function flowAngle(cssX, cssY, seed) {
    return (fractalNoise(0.006 * cssX + seed, 0.006 * cssY + seed * 2, 3) - 0.5) * 1.5;
  }

  function paintStrokes(ctx, rng, ref, pw, ph, seed, opts) {
    const cssArea = (pw / dpr) * (ph / dpr);
    const count = Math.round(cssArea / opts.density);
    ctx.lineCap = 'round';
    for (let i = 0; i < count; i++) {
      const x = rng() * pw;
      const y = rng() * ph;
      const col = sampleRef(ref, x, y);
      // Correlated value jitter (whole stroke lighter/darker) keeps hues
      // clean; only a whisper of independent hue drift
      const v = (rng() - 0.5) * opts.jitter;
      const c = {
        r: col.r + v + (rng() - 0.5) * 8,
        g: col.g + v + (rng() - 0.5) * 8,
        b: col.b + v + (rng() - 0.5) * 8
      };
      const len = (opts.len[0] + (opts.len[1] - opts.len[0]) * rng()) * dpr;
      const w = (opts.w[0] + (opts.w[1] - opts.w[0]) * rng()) * dpr;
      const half = len / 2;

      // Bend each stroke along the local flow direction
      const a0 = flowAngle(x / dpr, y / dpr, seed) + (rng() - 0.5) * 0.15;
      const x0 = x - Math.cos(a0) * half, y0 = y - Math.sin(a0) * half;
      const fx = x + Math.cos(a0) * half, fy = y + Math.sin(a0) * half;
      const a1 = flowAngle(fx / dpr, fy / dpr, seed) + (rng() - 0.5) * 0.15;
      const x1 = x + Math.cos(a1) * half, y1 = y + Math.sin(a1) * half;

      ctx.strokeStyle = rgba(c, opts.alpha * (0.75 + 0.5 * rng()));
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(x, y, x1, y1);
      ctx.stroke();
    }
  }

  function paintSun(ctx, rng, pw, ph) {
    const sx = 0.66 * pw, sy = 0.36 * ph;
    const r = 0.036 * Math.min(pw, ph);

    // Soft scumbled disc
    ctx.filter = 'blur(' + (2 * dpr) + 'px)';
    for (let i = 0; i < 5; i++) {
      const ox = (rng() - 0.5) * r * 0.6;
      const oy = (rng() - 0.5) * r * 0.6;
      ctx.fillStyle = i === 0 ? 'rgba(232,110,44,0.75)' : 'rgba(238,128,54,0.38)';
      ctx.beginPath();
      ctx.ellipse(sx + ox, sy + oy, r * (0.8 + 0.3 * rng()), r * (0.72 + 0.24 * rng()),
                  (rng() - 0.5) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Broken shimmer trailing below, like the harbor reflection
    ctx.filter = 'blur(' + dpr + 'px)';
    for (let i = 0; i < 10; i++) {
      const y = sy + r * (1.8 + rng() * 15);
      if (y > ph * 0.95) continue;
      const x = sx + (rng() - 0.5) * r * (2 + 3.5 * rng());
      drawStroke(ctx, rng, x, y, (rng() - 0.5) * 0.12,
                 r * (0.5 + 1.2 * rng()), r * 0.22,
                 'rgba(234,124,52,' + (0.2 + 0.22 * rng()).toFixed(2) + ')');
    }
    ctx.filter = 'none';
  }

  function paintSky(theme) {
    const pal = theme === 'dusk' ? SKY_DUSK : SKY_DAY;
    const pw = edgeMask.width, ph = edgeMask.height;
    const rng = seededRNG(pal.seed);
    const flowSeed = pal.seed * 0.013;

    const canvas = document.createElement('canvas');
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext('2d');

    // Coherent color masses: underpainting + sampling source
    const ref = buildRefField(pal, pw, ph, rng);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(ref.canvas, 0, 0, pw, ph);

    // Body of the painting: dense broad + medium strokes, blended soft
    const body = document.createElement('canvas');
    body.width = pw;
    body.height = ph;
    const bctx = body.getContext('2d');
    paintStrokes(bctx, rng, ref, pw, ph, flowSeed, { density: 300, len: [40, 80], w: [11, 18], alpha: 0.60, jitter: 24 });
    paintStrokes(bctx, rng, ref, pw, ph, flowSeed, { density: 170, len: [20, 46], w: [6, 11],  alpha: 0.55, jitter: 30 });
    ctx.filter = 'blur(' + (0.7 * dpr) + 'px)';
    ctx.drawImage(body, 0, 0);
    ctx.filter = 'none';

    // Crisp small dabs on top — the visible touch of the brush
    paintStrokes(ctx, rng, ref, pw, ph, flowSeed, { density: 260, len: [10, 24], w: [4, 7], alpha: 0.5, jitter: 44 });

    if (pal.sun) paintSun(ctx, rng, pw, ph);

    // Dissolve into the page through the organic edge
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(edgeMask, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    return canvas;
  }

  function renderSky() {
    if (!edgeMask) return;
    const theme = isDusk() ? 'dusk' : 'day';
    if (!texCache[theme]) texCache[theme] = paintSky(theme);
    skyTexture = texCache[theme];
    texTheme = theme;
    skyCtx.setTransform(1, 0, 0, 1, 0, 0);
    skyCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);
    skyCtx.drawImage(skyTexture, 0, 0);
  }

  // --- Clouds (brushy dab clusters) ---
  function makeCloudSprite(w, h, seed) {
    const rng = seededRNG(seed);
    const C = isDusk() ? CLOUD_DUSK : CLOUD_DAY;
    const canvas = document.createElement('canvas');
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');

    // Paint the strokes on a temp layer, then blend it soft as one mass
    const body = document.createElement('canvas');
    body.width = w * 2;
    body.height = h * 2;
    const bctx = body.getContext('2d');
    bctx.scale(2, 2);

    const baseY = h * 0.60;

    // Shadowed underside
    for (let i = 0; i < 8; i++) {
      const x = w * (0.2 + 0.6 * rng());
      const y = baseY + h * 0.10 * rng();
      drawStroke(bctx, rng, x, y, (rng() - 0.5) * 0.15,
                 w * (0.16 + 0.16 * rng()), h * (0.08 + 0.07 * rng()),
                 rgba(C.shadow, 0.25 + 0.15 * rng()));
    }

    // Massed body strokes
    for (let i = 0; i < 30; i++) {
      const px = w * (0.12 + 0.76 * rng());
      const dist = Math.abs(px - w * 0.5) / (w * 0.5);
      const py = baseY - h * (0.05 + 0.36 * rng()) * (1 - 0.55 * dist);
      const col = C.main[i % 2];
      const jit = 10;
      const c = {
        r: col.r + (rng() - 0.5) * jit,
        g: col.g + (rng() - 0.5) * jit,
        b: col.b + (rng() - 0.5) * jit
      };
      drawStroke(bctx, rng, px, py, (rng() - 0.5) * 0.35,
                 w * (0.10 + 0.14 * rng()), h * (0.09 + 0.10 * rng()),
                 rgba(c, 0.4 + 0.25 * rng()));
    }

    // Lit accents on the sunny edge
    for (let i = 0; i < 6; i++) {
      const px = w * (0.25 + 0.5 * rng());
      const py = baseY - h * (0.28 + 0.2 * rng());
      drawStroke(bctx, rng, px, py, (rng() - 0.5) * 0.25,
                 w * (0.08 + 0.10 * rng()), h * (0.05 + 0.05 * rng()),
                 rgba(C.accent, 0.25 + 0.18 * rng()));
    }

    ctx.filter = 'blur(1.6px)';
    ctx.drawImage(body, 0, 0);
    ctx.filter = 'none';

    return canvas;
  }

  const CLOUD_SPECS = [
    { ny: 0.20, w: 190, h: 80, speed: 0.006, seed: 11 },
    { ny: 0.42, w: 150, h: 66, speed: 0.009, seed: 27 },
    { ny: 0.30, w: 120, h: 56, speed: 0.012, seed: 43 },
    { ny: 0.58, w: 100, h: 48, speed: 0.015, seed: 59 }
  ];

  function buildClouds() {
    const rng = seededRNG(7);
    clouds = CLOUD_SPECS.map(spec => ({
      nx: rng(),
      ny: spec.ny + (rng() - 0.5) * 0.06,
      w: spec.w,
      h: spec.h,
      speed: spec.speed,
      sprite: makeCloudSprite(spec.w, spec.h, spec.seed)
    }));
  }

  function retintClouds() {
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].sprite = makeCloudSprite(clouds[i].w, clouds[i].h, CLOUD_SPECS[i].seed);
    }
  }

  function drawClouds(dt) {
    if (!cloudCtx || width <= 0) return;
    cloudCtx.setTransform(1, 0, 0, 1, 0, 0);
    cloudCtx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
    cloudCtx.scale(dpr, dpr);

    for (const c of clouds) {
      c.nx += c.speed * dt / 60;
      const margin = c.w / width;
      if (c.nx > 1 + margin) c.nx = -margin;
      cloudCtx.drawImage(c.sprite, c.nx * width - c.w / 2, c.ny * height - c.h / 2, c.w, c.h);
    }

    // Mask clouds to the sky's organic shape
    if (skyTexture) {
      cloudCtx.setTransform(1, 0, 0, 1, 0, 0);
      cloudCtx.globalCompositeOperation = 'destination-in';
      cloudCtx.drawImage(skyTexture, 0, 0);
      cloudCtx.globalCompositeOperation = 'source-over';
    }
  }

  // --- Bird SVG (side view, facing right) ---
  function birdSVGMarkup() {
    return `
      <g>
        <defs>
          <radialGradient id="bird-body-grad" cx="0.45" cy="0.35" r="0.65">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="55%" stop-color="#F5F1EB"/>
            <stop offset="100%" stop-color="#DFD9CE"/>
          </radialGradient>
          <linearGradient id="bird-wing-grad" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color="#FAF7F2"/>
            <stop offset="70%" stop-color="#EAE4DA"/>
            <stop offset="100%" stop-color="#D6CFC2"/>
          </linearGradient>
        </defs>
        <g class="wing-far">
          <path d="M25 22.5 Q20 12, 9 8 Q15.5 16.5, 20.5 21.5 Q22.5 23.2, 25 23.2 Z" fill="#E0DACF" opacity="0.85"/>
          <path d="M22 20 Q17 14.5, 11.5 10.5" fill="none" stroke="#C4BCAE" stroke-width="0.4" opacity="0.3"/>
        </g>
        <path d="M17 24 Q10.5 21.8, 7.8 23.4 Q11.8 26.6, 17 26.6 Q15.4 25.3, 17 24 Z" fill="#E8E2D8"/>
        <path d="M9.5 23.2 Q13 24.6, 16 25.4" fill="none" stroke="#C4BCAE" stroke-width="0.4" opacity="0.3"/>
        <ellipse cx="24.5" cy="24.5" rx="9" ry="4.6" fill="url(#bird-body-grad)"/>
        <path d="M16.5 25 Q24 29.6, 32.5 25 Q24 27.6, 16.5 25 Z" fill="#C8C0B0" opacity="0.3"/>
        <ellipse cx="24.5" cy="24.5" rx="9" ry="4.6" fill="none" stroke="#B8B0A0" stroke-width="0.35" opacity="0.2"/>
        <ellipse cx="22.5" cy="23" rx="3" ry="1.8" fill="white" opacity="0.25"/>
        <ellipse cx="30" cy="22.5" rx="4.2" ry="3.4" fill="#F5F1EB"/>
        <circle cx="32.5" cy="21" r="3.4" fill="url(#bird-body-grad)"/>
        <circle cx="31.5" cy="20" r="1.1" fill="white" opacity="0.3"/>
        <circle cx="32.5" cy="21" r="3.4" fill="none" stroke="#B8B0A2" stroke-width="0.3" opacity="0.2"/>
        <path d="M35.6 20.3 L39.6 21.5 L35.7 22.6 Q36.3 21.4, 35.6 20.3 Z" fill="#E8A030"/>
        <path d="M35.6 20.3 L39.6 21.5 L35.7 22.6" fill="none" stroke="#B07020" stroke-width="0.3" opacity="0.4"/>
        <circle cx="33.5" cy="20.5" r="0.55" fill="#1a1a1a"/>
        <circle cx="33.7" cy="20.3" r="0.18" fill="white" opacity="0.7"/>
        <g class="wing-near">
          <path d="M24 22.8 Q17.5 8.5, 4.5 4.5 Q9.5 13.5, 16.5 19 Q20.5 22, 24 24.2 Z" fill="url(#bird-wing-grad)"/>
          <path d="M24 22.8 Q17.5 8.5, 4.5 4.5 Q9.5 13.5, 16.5 19 Q20.5 22, 24 24.2 Z" fill="none" stroke="#B8B0A0" stroke-width="0.35" opacity="0.22"/>
          <path d="M21 19.5 Q14.5 12.5, 8 7.5" fill="none" stroke="#CCC4B4" stroke-width="0.45" opacity="0.35"/>
          <path d="M22.5 21.3 Q16.5 16, 10.5 11.5" fill="none" stroke="#D4CCC0" stroke-width="0.35" opacity="0.28"/>
          <path d="M8.5 7.5 Q6 5.6, 4.5 4.5 Q7.5 9.5, 10.5 12.5 Z" fill="#C9C2B4" opacity="0.5"/>
        </g>
      </g>
    `;
  }

  function createBirdSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '64');
    svg.setAttribute('height', '64');
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('fill', 'none');
    svg.innerHTML = birdSVGMarkup();
    return svg;
  }

  // --- Bird Management ---
  function createBird(x, y) {
    if (birds.length >= MAX_BIRDS) return null;

    const size = 40 + Math.round(26 * Math.random());
    const wrapper = document.createElement('div');
    wrapper.className = 'sky-bird';
    wrapper.style.cssText = 'position:absolute;pointer-events:none;will-change:transform,opacity;filter:blur(0.45px) drop-shadow(0 1px 3px rgba(42,37,32,0.10));z-index:5;';
    const svg = createBirdSVG();
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    wrapper.appendChild(svg);

    const bird = {
      el: wrapper,
      wingNear: svg.querySelector('.wing-near'),
      wingFar: svg.querySelector('.wing-far'),
      nx: x,
      ny: y,
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: 0.03 + 0.02 * Math.random(),
      size: size,
      depth: (size - 40) / 26,        // 0 = far/small, 1 = near/large
      phase: Math.random() * 100,
      wingPhase: Math.random() * Math.PI * 2,
      wingAmp: 4,
      flapping: false,
      stateEnd: time + 1 + 2 * Math.random(),
      vy: 0,
      bank: 0,
      scale: 0,
      spawnTime: time,
      offsetY: 0
    };

    skyInner.appendChild(wrapper);
    birds.push(bird);
    return bird;
  }

  function updateBird(b, dt) {
    const t = time;

    // Scale-in pop on spawn
    const age = t - b.spawnTime;
    if (age < 0.35) {
      const p = age / 0.35;
      b.scale = p < 0.6 ? (p / 0.6) * 1.15 : 1.15 - (p - 0.6) / 0.4 * 0.15;
    } else {
      b.scale = 1;
    }

    // Glide/flap state machine
    if (t > b.stateEnd) {
      b.flapping = !b.flapping;
      b.stateEnd = t + (b.flapping ? 0.8 + Math.random() : 2 + 3.5 * Math.random());
    }

    // Wings: fast strokes while flapping, gentle sway while gliding
    const targetAmp = b.flapping ? 30 : 4;
    b.wingAmp += (targetAmp - b.wingAmp) * Math.min(1, 6 * dt);
    b.wingPhase += (b.flapping ? 11 : 1.8) * dt;

    // Speed: flapping accelerates, gliding slowly bleeds off
    const speedScale = 0.6 + 0.4 * b.depth; // far birds drift slower
    const targetSpeed = (b.flapping ? 0.065 : 0.032) * speedScale;
    b.speed += (targetSpeed - b.speed) * Math.min(1, 1.2 * dt);

    // Vertical: climb a touch while flapping, sink gently while gliding,
    // plus slow wander
    const lift = b.flapping ? -0.006 : 0.004;
    const wander = 0.010 * Math.sin(0.5 * t + b.phase);
    b.vy += (lift + wander - b.vy) * Math.min(1, 2 * dt);

    // Soft vertical bounds
    if (b.ny < 0.15) b.vy += (0.15 - b.ny) * 0.3 * dt * 60 * 0.01;
    if (b.ny > 0.85) b.vy -= (b.ny - 0.85) * 0.3 * dt * 60 * 0.01;

    b.nx += b.dir * b.speed * dt;
    b.ny += b.vy * dt;
    b.ny = Math.max(0.10, Math.min(0.90, b.ny));

    // Turn around near horizontal edges with a flap burst
    if ((b.dir > 0 && b.nx > 0.92) || (b.dir < 0 && b.nx < 0.08)) {
      b.dir *= -1;
      b.flapping = true;
      b.stateEnd = t + 1 + 0.5 * Math.random();
      b.speed *= 0.4;
    }
    b.nx = Math.max(0.04, Math.min(0.96, b.nx));

    // Bank into climbs/dives; a touch of body rock while flapping
    const targetBank = -b.vy * 600 + (b.flapping ? 2.5 * Math.sin(b.wingPhase) : 0);
    b.bank += (Math.max(-14, Math.min(14, targetBank)) - b.bank) * Math.min(1, 4 * dt);

    // Floaty bob while gliding
    b.offsetY = (b.flapping ? 0.8 : 2.4) * Math.sin(1.1 * t + b.phase);
  }

  function updateBirdDOM(b) {
    b.el.style.left = (b.nx * 100) + '%';
    b.el.style.top = (b.ny * 100) + '%';
    const opacity = 0.82 + 0.18 * b.depth;
    b.el.style.opacity = String(opacity);
    b.el.style.transform =
      `translate(-50%,-50%) translateY(${b.offsetY.toFixed(2)}px) ` +
      `scaleX(${b.dir}) rotate(${b.bank.toFixed(2)}deg) scale(${b.scale})`;

    const wing = b.wingAmp * Math.sin(b.wingPhase) - 3;
    b.wingNear.setAttribute('transform', `rotate(${wing.toFixed(2)} 24 22.8)`);
    const wingF = b.wingAmp * 0.85 * Math.sin(b.wingPhase - 0.35) - 3;
    b.wingFar.setAttribute('transform', `rotate(${wingF.toFixed(2)} 25 22.5)`);
  }

  // --- Init ---
  function init() {
    skyCanvas = document.getElementById('sky-canvas');
    cloudCanvas = document.getElementById('sky-clouds');
    container = document.querySelector('.hero-container');
    skyInner = document.querySelector('.hero-sky-inner');

    if (!skyCanvas || !cloudCanvas || !container || !skyInner) return;

    skyCtx = skyCanvas.getContext('2d');
    cloudCtx = cloudCanvas.getContext('2d');

    resize();
    buildClouds();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    // Repaint sky and re-tint clouds when the theme toggles
    new MutationObserver(() => {
      const theme = isDusk() ? 'dusk' : 'day';
      if (theme !== texTheme && edgeMask) {
        renderSky();
        retintClouds();
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Initial flock, staggered
    setTimeout(() => { createBird(0.30, 0.30 + 0.1 * Math.random()); }, 400);
    setTimeout(() => { createBird(0.60, 0.45 + 0.1 * Math.random()); }, 900);
    setTimeout(() => { createBird(0.45, 0.62 + 0.1 * Math.random()); }, 1500);

    skyInner.addEventListener('click', onSkyClick);

    animId = requestAnimationFrame(animate);
  }

  let resizeTimer;

  function resize() {
    if (!skyInner) return;
    const rect = skyInner.getBoundingClientRect();
    width = Math.floor(rect.width);
    height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;

    dpr = Math.min(devicePixelRatio || 1, 2);

    if (texW !== width || texH !== height) {
      texW = width;
      texH = height;

      edgeMask = generateEdgeMask(width, height);
      texCache = {};

      skyCanvas.width = Math.round(width * dpr);
      skyCanvas.height = Math.round(height * dpr);
      skyCanvas.style.width = width + 'px';
      skyCanvas.style.height = height + 'px';

      cloudCanvas.width = skyCanvas.width;
      cloudCanvas.height = skyCanvas.height;
      cloudCanvas.style.width = width + 'px';
      cloudCanvas.style.height = height + 'px';

      renderSky();
    }
  }

  function onSkyClick(e) {
    const rect = skyInner.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    if (nx < 0.02 || nx > 0.98 || ny < 0.02 || ny > 0.98) return;
    createBird(nx, Math.max(0.12, Math.min(0.88, ny)));
  }

  // --- Animation Loop ---
  let lastTime = 0;

  function animate(timestamp) {
    animId = requestAnimationFrame(animate);
    if (timestamp === undefined) return;
    if (!lastTime) { lastTime = timestamp; return; }

    try {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      time += dt;

      if (width <= 0 || height <= 0) return;

      for (const bird of birds) {
        updateBird(bird, dt);
        updateBirdDOM(bird);
      }

      drawClouds(dt);
    } catch (e) {
      console.warn('Animation frame error:', e.message);
    }
  }

  // Initialize when DOM is ready
  function safeInit() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        init();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else {
    safeInit();
  }
})();
