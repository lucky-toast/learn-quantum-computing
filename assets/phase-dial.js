// Reusable complex-plane widgets for phase gates.
// PhaseDial.mount(el): animates phase gates acting on the state |+⟩.
// PhaseDial.explorer(el): drag a number z and see i·z, a quarter turn away.
window.PhaseDial = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const draw = (tag, attrs = {}, text) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const rad = (deg) => (deg * Math.PI) / 180;
  const norm = (deg) => ((deg % 360) + 360) % 360;
  const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((done) => setTimeout(done, ms));

  const GATES = { T: 45, S: 90, Z: 180, "S⁻¹": -90 };
  const FACTOR = { 0: "1", 45: "(1 + i)/√2", 90: "i", 135: "(−1 + i)/√2", 180: "−1", 225: "(−1 − i)/√2", 270: "−i", 315: "(1 − i)/√2" };
  const BOTTOM = { 0: "1/√2", 45: "(1 + i)/2", 90: "i/√2", 135: "(−1 + i)/2", 180: "−1/√2", 225: "(−1 − i)/2", 270: "−i/√2", 315: "(1 − i)/2" };
  const NAME = { 0: "|+⟩", 90: "|+i⟩", 180: "|−⟩", 270: "|−i⟩" };

  function arrowHead(cx, cy, tipX, tipY) {
    const len = Math.hypot(tipX - cx, tipY - cy) || 1;
    const ux = (tipX - cx) / len;
    const uy = (tipY - cy) / len;
    const bx = tipX - 12 * ux;
    const by = tipY - 12 * uy;
    return `${tipX},${tipY} ${bx - 5.5 * uy},${by + 5.5 * ux} ${bx + 5.5 * uy},${by - 5.5 * ux}`;
  }

  function dial(label, accent) {
    const c = 130;
    const R = 92;
    const amp = Math.SQRT1_2 * R;
    const root = draw("svg", { viewBox: "0 0 260 260", class: "pd-svg", role: "img", "aria-label": label });
    root.append(
      draw("line", { x1: 16, y1: c, x2: 244, y2: c, class: "pd-axis" }),
      draw("line", { x1: c, y1: 16, x2: c, y2: 244, class: "pd-axis" }),
      draw("circle", { cx: c, cy: c, r: R, class: "pd-ring" }),
      draw("circle", { cx: c, cy: c, r: amp, class: "pd-guide" }),
      draw("text", { x: c + R + 15, y: c - 7, class: "pd-label" }, "1"),
      draw("text", { x: c + 11, y: c - R - 7, class: "pd-label" }, "i"),
      draw("text", { x: c - R - 15, y: c - 7, class: "pd-label" }, "−1"),
      draw("text", { x: c + 15, y: c + R + 17, class: "pd-label" }, "−i"),
    );
    const marks = draw("g");
    const arc = draw("path", { class: "pd-arc" });
    const shaft = draw("line", { x1: c, y1: c, class: accent ? "pd-arrow pd-hot" : "pd-arrow" });
    const head = draw("polygon", { class: accent ? "pd-head pd-hot" : "pd-head" });
    root.append(marks, arc, shaft, head);
    const at = (deg, r) => [c + r * Math.cos(rad(deg)), c - r * Math.sin(rad(deg))];
    return {
      root,
      set(deg) {
        const [x, y] = at(deg, amp);
        shaft.setAttribute("x2", x);
        shaft.setAttribute("y2", y);
        head.setAttribute("points", arrowHead(c, c, x, y));
        const sweep = norm(deg);
        if (sweep < 0.01 || sweep > 359.99) arc.removeAttribute("d");
        else {
          const [ex, ey] = at(sweep, 30);
          arc.setAttribute("d", `M ${c + 30} ${c} A 30 30 0 ${sweep > 180 ? 1 : 0} 0 ${ex} ${ey}`);
        }
      },
      mark(deg) {
        const [x, y] = at(deg, amp);
        marks.append(draw("circle", { cx: x, cy: y, r: 3.5, class: "pd-mark" }));
      },
      clear() { marks.replaceChildren(); },
    };
  }

  function mount(el) {
    let angle = 0;
    let history = [];
    let busy = false;
    const row = make("div", "pd-dials");
    const topFig = make("figure", "pd-fig");
    const botFig = make("figure", "pd-fig");
    const top = dial("Top amplitude in the complex plane. It never moves.", false);
    const bottom = dial("Bottom amplitude in the complex plane. Phase gates rotate it.", true);
    topFig.append(top.root, make("figcaption", "", "Top amplitude: S multiplies it by 1"));
    botFig.append(bottom.root, make("figcaption", "", "Bottom amplitude: S multiplies it by i"));
    row.append(topFig, botFig);

    const controls = make("div", "lab-row");
    const buttons = [];
    const add = (label, cls, fn) => {
      const b = make("button", cls, label);
      b.type = "button";
      b.onclick = fn;
      controls.append(b);
      buttons.push(b);
      return b;
    };
    add("Play S four times", "primary", () => run(["S", "S", "S", "S"]));
    Object.keys(GATES).forEach((g) => add(`Apply ${g}`, "", () => run([g])));
    const reset = add("Reset", "", () => {
      angle = 0;
      history = [];
      top.clear();
      bottom.clear();
      bottom.mark(0);
      bottom.set(0);
      say("Reset to |+⟩. Both amplitudes are 1/√2.");
      show();
    });

    const status = make("p", "pd-status");
    status.setAttribute("aria-live", "polite");
    const say = (text) => { status.textContent = text; };
    const table = make("table", "pd-table");
    const cell = (label) => {
      const tr = make("tr");
      const value = make("td");
      tr.append(make("th", "", label), value);
      table.append(tr);
      return value;
    };
    const gatesCell = cell("Gates applied");
    const turnCell = cell("Total turn");
    const factorCell = cell("Bottom multiplied by");
    const stateCell = cell("State");
    const bars = make("div", "lab-card");
    const bar = (label) => {
      const line = make("div", "prob pd-prob");
      const track = make("div", "track");
      const fill = make("div", "fill");
      const value = make("span");
      track.append(fill);
      line.append(make("span", "", label), track, value);
      bars.append(line);
      return (p) => { fill.style.width = `${p * 100}%`; value.textContent = `${Math.round(p * 100)}%`; };
    };
    const now = bar("Measure now: P(0)");
    const after = bar("H, then measure: P(0)");

    function show() {
      const d = norm(angle);
      const shown = history.length > 10 ? `… ${history.slice(-10).join(" ")}` : history.join(" ");
      gatesCell.textContent = shown || "None";
      turnCell.textContent = angle === d ? `${angle}°` : `${angle}°, which lands at ${d}°`;
      factorCell.textContent = FACTOR[d];
      stateCell.textContent = `(1/√2, ${BOTTOM[d]})${NAME[d] ? ` = ${NAME[d]}` : ""}`;
      now(0.5);
      after((1 + Math.cos(rad(d))) / 2);
      buttons.forEach((b) => { b.disabled = busy; });
      reset.disabled = busy;
    }
    const land = (name) => {
      history.push(name);
      bottom.mark(norm(angle));
      const d = norm(angle);
      if (d === 0) say(`${name} completed the circle. The bottom amplitude is back where it started.`);
      else say(`${name} turned the bottom amplitude by ${GATES[name]}°. Its length did not change.`);
      show();
    };
    const step = (name) => new Promise((done) => {
      const from = angle;
      const to = angle + GATES[name];
      if (calm() || document.hidden) {
        angle = to;
        bottom.set(angle);
        land(name);
        done();
        return;
      }
      const ms = 450 + Math.abs(GATES[name]) * 3;
      const t0 = performance.now();
      let finished = false;
      const frame = (t) => {
        if (finished) return;
        const u = document.hidden ? 1 : Math.min(1, (t - t0) / ms);
        const eased = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
        bottom.set(from + (to - from) * eased);
        if (u < 1) requestAnimationFrame(frame);
        else {
          finished = true;
          angle = to;
          bottom.set(angle);
          land(name);
          done();
        }
      };
      requestAnimationFrame(frame);
      // Animation frames pause in a background tab, so finish the step on a timer.
      setTimeout(() => frame(t0 + ms), ms + 120);
    });
    async function run(names) {
      busy = true;
      show();
      for (let i = 0; i < names.length; i += 1) {
        await step(names[i]);
        if (i < names.length - 1 && !calm() && !document.hidden) await wait(420);
      }
      busy = false;
      show();
    }
    top.set(0);
    bottom.set(0);
    bottom.mark(0);
    say("Start in |+⟩. Press Play, or apply gates one at a time.");
    el.append(row, controls, status, table, bars);
    show();
    return { run, state: () => ({ angle, history: [...history] }) };
  }

  const num = (n) => (n < 0 ? `−${-n}` : String(n));
  function complex(x, y) {
    if (y === 0) return num(x);
    const mag = Math.abs(y) === 1 ? "" : Math.abs(y);
    if (x === 0) return `${y < 0 ? "−" : ""}${mag}i`;
    return `${num(x)} ${y < 0 ? "−" : "+"} ${mag}i`;
  }

  function explorer(el) {
    const c = 160;
    const u = 40;
    const limit = 3;
    let x = 2;
    let y = 1;
    const px = (a) => c + a * u;
    const py = (b) => c - b * u;
    const root = draw("svg", { viewBox: "0 0 320 320", class: "pd-svg pd-plane", role: "group", "aria-label": "Complex plane with z and i times z" });
    for (let k = -limit; k <= limit; k += 1) {
      root.append(
        draw("line", { x1: px(k), y1: py(-limit), x2: px(k), y2: py(limit), class: k === 0 ? "pd-axis" : "pd-grid" }),
        draw("line", { x1: px(-limit), y1: py(k), x2: px(limit), y2: py(k), class: k === 0 ? "pd-axis" : "pd-grid" }),
      );
      if (k !== 0) {
        root.append(draw("text", { x: px(k), y: c + 15, class: "pd-tick" }, num(k)));
        root.append(draw("text", { x: c - 11, y: py(k) + 4, class: "pd-tick" }, Math.abs(k) === 1 ? (k < 0 ? "−i" : "i") : `${num(k)}i`));
      }
    }
    root.append(draw("text", { x: 304, y: c - 7, class: "pd-label" }, "real"), draw("text", { x: c + 26, y: 15, class: "pd-label" }, "imaginary"));
    const legsZ = draw("polyline", { class: "pd-leg" });
    const legsI = draw("polyline", { class: "pd-leg pd-leg-hot" });
    const turn = draw("path", { class: "pd-arc" });
    const zLine = draw("line", { x1: c, y1: c, class: "pd-arrow" });
    const zHead = draw("polygon", { class: "pd-head" });
    const iLine = draw("line", { x1: c, y1: c, class: "pd-arrow pd-hot" });
    const iHead = draw("polygon", { class: "pd-head pd-hot" });
    const zText = draw("text", { class: "pd-name" }, "z");
    const iText = draw("text", { class: "pd-name pd-name-hot" }, "i·z");
    const handle = draw("circle", { r: 15, class: "pd-handle", tabindex: 0, role: "slider", "aria-label": "Point z. Use arrow keys to move it." });
    root.append(legsZ, legsI, turn, zLine, zHead, iLine, iHead, zText, iText, handle);

    const algebra = make("p", "pd-algebra");
    algebra.setAttribute("aria-live", "polite");
    const matrix = make("div", "math");
    const cells = (values) => {
      const box = make("span", "mx");
      values.forEach((v) => box.append(make("span", "", v)));
      return box;
    };
    const rotation = make("span", "mx two");
    ["0", "−1", "1", "0"].forEach((v) => rotation.append(make("span", "", v)));

    function update() {
      const ix = -y;
      const iy = x;
      legsZ.setAttribute("points", `${c},${c} ${px(x)},${c} ${px(x)},${py(y)}`);
      legsI.setAttribute("points", `${c},${c} ${c},${py(x)} ${px(ix)},${py(iy)}`);
      zLine.setAttribute("x2", px(x));
      zLine.setAttribute("y2", py(y));
      zHead.setAttribute("points", arrowHead(c, c, px(x), py(y)));
      iLine.setAttribute("x2", px(ix));
      iLine.setAttribute("y2", py(iy));
      iHead.setAttribute("points", arrowHead(c, c, px(ix), py(iy)));
      const len = Math.hypot(x, y);
      const out = (a, b) => [a + (a / len) * 0.62, b + (b / len) * 0.62];
      const [zx, zy] = out(x, y);
      const [wx, wy] = out(ix, iy);
      zText.setAttribute("x", px(zx));
      zText.setAttribute("y", py(zy) + 5);
      iText.setAttribute("x", px(wx));
      iText.setAttribute("y", py(wy) + 5);
      const r = 22;
      turn.setAttribute("d", `M ${c + (r * x) / len} ${c - (r * y) / len} A ${r} ${r} 0 0 0 ${c + (r * ix) / len} ${c - (r * iy) / len}`);
      handle.setAttribute("cx", px(x));
      handle.setAttribute("cy", py(y));
      handle.setAttribute("aria-valuetext", `z = ${complex(x, y)}, i times z = ${complex(ix, iy)}`);
      algebra.textContent = `i · (${complex(x, y)}) = (${num(x)})i + (${num(y)})i² = (${num(x)})i − (${num(y)}) = ${complex(ix, iy)}`;
      matrix.replaceChildren(rotation, cells([num(x), num(y)]), document.createTextNode("="), cells([num(ix), num(iy)]));
    }
    const moveTo = (a, b) => {
      const nx = Math.max(-limit, Math.min(limit, a));
      const ny = Math.max(-limit, Math.min(limit, b));
      if (nx === 0 && ny === 0) return;
      x = nx;
      y = ny;
      update();
    };
    const fromEvent = (event) => {
      const point = root.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const p = point.matrixTransform(root.getScreenCTM().inverse());
      moveTo(Math.round((p.x - c) / u), Math.round((c - p.y) / u));
    };
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      handle.focus();
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", (event) => {
      if (handle.hasPointerCapture(event.pointerId)) fromEvent(event);
    });
    handle.addEventListener("keydown", (event) => {
      const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      moveTo(x + move[0], y + move[1]);
    });
    el.append(root, algebra, matrix);
    update();
    return { moveTo, value: () => [x, y] };
  }

  return { mount, explorer };
})();
