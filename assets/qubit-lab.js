// Reusable one-qubit circuit lab with complex amplitudes.
// QubitLab.mount(el, {gates, inputs: [{label, state}], maxGates, hint, onSolve})
window.QubitLab = (() => {
  const r = Math.SQRT1_2;
  const c = (re, im = 0) => [re, im];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const GATES = {
    X: [[c(0), c(1)], [c(1), c(0)]],
    Z: [[c(1), c(0)], [c(0), c(-1)]],
    H: [[c(r), c(r)], [c(r), c(-r)]],
    S: [[c(1), c(0)], [c(0), c(0, 1)]],
  };
  const STATES = {
    zero: [c(1), c(0)], one: [c(0), c(1)],
    plus: [c(r), c(r)], minus: [c(r), c(-r)],
  };
  const apply = (m, v) => m.map((row) => add(mul(row[0], v[0]), mul(row[1], v[1])));
  const run = (names, state) => names.reduce((v, n) => apply(GATES[n], v), state);
  const prob = (a) => a[0] * a[0] + a[1] * a[1];

  function realText(x) {
    const abs = Math.abs(x);
    const sign = x < 0 ? "−" : "";
    if (abs < 1e-9) return "0";
    if (Math.abs(abs - 1) < 1e-9) return sign + "1";
    if (Math.abs(abs - r) < 1e-9) return sign + "1/√2";
    return sign + abs.toFixed(3);
  }
  function ampText(a) {
    if (Math.abs(a[1]) < 1e-9) return realText(a[0]);
    const im = realText(Math.abs(a[1])) + "i";
    if (Math.abs(a[0]) < 1e-9) return (a[1] < 0 ? "−" : "") + im;
    return `${realText(a[0])} ${a[1] < 0 ? "−" : "+"} ${im}`;
  }
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function mount(el, cfg) {
    let circuit = [];
    let solved = false;
    const palette = make("div", "lab-row");
    const wire = make("div", "wire");
    wire.setAttribute("aria-label", "Current circuit");
    const controls = make("div", "lab-row");
    const results = make("div", "lab-results");
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    const max = cfg.maxGates || 4;

    const clearResult = () => { results.replaceChildren(); fb.textContent = ""; fb.className = "fb"; };
    const drawWire = () => {
      wire.replaceChildren(make("span", "line", "input ─"));
      circuit.forEach((g) => { wire.append(make("span", "g", g), make("span", "line", "─")); });
      wire.append(make("span", "line", "measure"));
      gateButtons.forEach((b) => (b.disabled = circuit.length >= max));
    };
    const gateButtons = cfg.gates.map((g) => {
      const b = make("button", "", `Add ${g}`);
      b.type = "button";
      b.onclick = () => { circuit.push(g); clearResult(); drawWire(); };
      palette.append(b);
      return b;
    });
    const button = (label, cls, fn) => {
      const b = make("button", cls, label);
      b.type = "button";
      b.onclick = fn;
      controls.append(b);
    };
    button("Run on both inputs", "primary", () => {
      results.replaceChildren();
      const outcomes = cfg.inputs.map((input) => {
        const out = run(circuit, STATES[input.state]);
        const card = make("div", "lab-card");
        card.append(make("div", "", `Input ${input.label} → (${ampText(out[0])}, ${ampText(out[1])})`));
        out.forEach((a, i) => {
          const p = prob(a);
          const line = make("div", "prob");
          const track = make("div", "track");
          const fill = make("div", "fill");
          fill.style.width = `${p * 100}%`;
          track.append(fill);
          line.append(make("span", "", `P(${i})`), track, make("span", "", `${Math.round(p * 100)}%`));
          card.append(line);
        });
        results.append(card);
        return prob(out[0]);
      });
      const certain = outcomes.every((p) => p < 1e-9 || p > 1 - 1e-9);
      const different = Math.abs(outcomes[0] - outcomes[1]) > 0.5;
      if (certain && different) {
        const zeroInput = outcomes[0] > 0.5 ? cfg.inputs[0] : cfg.inputs[1];
        const oneInput = outcomes[0] > 0.5 ? cfg.inputs[1] : cfg.inputs[0];
        fb.className = "fb good";
        fb.textContent = `Solved. Measuring 0 means ${zeroInput.label}, and measuring 1 means ${oneInput.label}, every time.`;
        if (!solved) { solved = true; if (cfg.onSolve) cfg.onSolve(circuit.slice()); }
      } else {
        fb.className = "fb bad";
        fb.textContent = "Still a coin flip, so one measurement cannot identify the input.";
      }
    });
    button("Undo", "", () => { circuit.pop(); clearResult(); drawWire(); });
    button("Clear", "", () => { circuit = []; clearResult(); drawWire(); });
    if (cfg.hint) button("Hint", "", () => { fb.className = "fb"; fb.textContent = cfg.hint; });

    el.append(palette, wire, controls, results, fb);
    drawWire();
  }

  return { mount, GATES, STATES, run, prob };
})();
