// Reusable two-qubit circuit lab. Requires product-lab.js for number formatting.
// Amplitudes are ordered 00, 01, 10, 11, with qubit A as the left digit.
// TwoQubitLab.mount(el, {targets: [{amps}], gates, maxGates, hint, onSolve})
window.TwoQubitLab = (() => {
  const r = Math.SQRT1_2;
  const swapOn = (mask) => (v) => v.map((_, i) => v[i ^ mask]);
  const signOn = (mask) => (v) => v.map((x, i) => (i & mask ? -x : x));
  const hadOn = (mask) => (v) => v.map((_, i) => {
    const low = i & ~mask;
    return r * (v[low] + (i & mask ? -v[low | mask] : v[low | mask]));
  });
  const OPS = {
    "X on A": swapOn(2), "X on B": swapOn(1),
    "Z on A": signOn(2), "Z on B": signOn(1),
    "H on A": hadOn(2), "H on B": hadOn(1),
    CNOT: (v) => [v[0], v[1], v[3], v[2]],
  };
  const run = (names) => names.reduce((v, n) => OPS[n](v), [1, 0, 0, 0]);
  const overlap = (u, v) => u.reduce((sum, x, i) => sum + x * v[i], 0);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const vector = (v) => `(${v.map(ProductLab.text).join(", ")})`;

  function mount(el, cfg) {
    let index = 0;
    let circuit = [];
    const max = cfg.maxGates || 5;
    const title = make("p");
    const palette = make("div", "lab-row");
    const wires = make("div", "two-wire");
    wires.setAttribute("aria-label", "Current two-qubit circuit");
    const controls = make("div", "lab-row");
    const results = make("div", "lab-card");
    results.hidden = true;
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    const say = (cls, msg) => { fb.className = `fb ${cls}`; fb.textContent = msg; };
    const reset = () => { results.hidden = true; results.replaceChildren(); say("", ""); };
    const drawWires = () => {
      wires.replaceChildren(make("span", "line", "A |0⟩ ─"), make("span", "line", "B |0⟩ ─"));
      circuit.forEach((g) => {
        const on = (q) => {
          if (g === "CNOT") return make("span", "g ctl", q === "A" ? "●" : "⊕");
          return g.endsWith(q) ? make("span", "g", g[0]) : make("span", "line", "───");
        };
        wires.append(on("A"), on("B"));
      });
      gateButtons.forEach((b) => (b.disabled = circuit.length >= max || locked));
    };
    let locked = false;
    const gateButtons = cfg.gates.map((g) => {
      const b = make("button", "", g);
      b.type = "button";
      b.onclick = () => { circuit.push(g); reset(); drawWires(); };
      palette.append(b);
      return b;
    });
    const add = (label, cls, fn) => {
      const b = make("button", cls, label);
      b.type = "button";
      b.onclick = fn;
      controls.append(b);
      return b;
    };
    const showResult = (out) => {
      results.replaceChildren(make("div", "", `Output: ${vector(out)}`));
      ["00", "01", "10", "11"].forEach((label, i) => {
        const p = out[i] * out[i];
        const line = make("div", "prob");
        const track = make("div", "track");
        const fill = make("div", "fill");
        fill.style.width = `${p * 100}%`;
        track.append(fill);
        line.append(make("span", "", label), track, make("span", "", `${Math.round(p * 100)}%`));
        results.append(line);
      });
      results.hidden = false;
    };
    const runButton = add("Run", "primary", () => {
      const out = run(circuit);
      showResult(out);
      const fit = overlap(out, cfg.targets[index].amps);
      if (Math.abs(Math.abs(fit) - 1) > 1e-9) return say("bad", "Not the target yet. Compare the output with the target entry by entry.");
      locked = true;
      runButton.disabled = undo.disabled = clear.disabled = true;
      drawWires();
      say("good", fit > 0 ? "Solved. Your circuit produces the target." : "Solved. Your output differs only by an overall sign, which no measurement can detect.");
      if (index < cfg.targets.length - 1) next.hidden = false;
      else if (cfg.onSolve) cfg.onSolve();
    });
    const undo = add("Undo", "", () => { circuit.pop(); reset(); drawWires(); });
    const clear = add("Clear", "", () => { circuit = []; reset(); drawWires(); });
    const next = add("Next target", "", () => {
      index += 1;
      circuit = [];
      locked = false;
      runButton.disabled = undo.disabled = clear.disabled = false;
      next.hidden = true;
      reset();
      draw();
    });
    next.hidden = true;
    if (cfg.hint) add("Hint", "", () => say("", cfg.hint));
    const draw = () => {
      title.textContent = `Target ${index + 1} of ${cfg.targets.length}: ${vector(cfg.targets[index].amps)}`;
      drawWires();
    };
    el.append(title, palette, wires, controls, results, fb);
    draw();
  }
  return { mount, run, OPS };
})();
