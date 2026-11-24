// Reusable two-qubit product-state puzzle. Requires qubit-lab.js.
// ProductLab.mount(el, {targets: [{amps, impossible}], hint, onSolve})
window.ProductLab = (() => {
  const CHOICES = [["|0⟩", "zero"], ["|1⟩", "one"], ["|+⟩", "plus"], ["|−⟩", "minus"]];
  const r = Math.SQRT1_2;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const real = (key) => QubitLab.STATES[key].map((a) => a[0]);
  const product = (a, b) => [a[0] * b[0], a[0] * b[1], a[1] * b[0], a[1] * b[1]];
  const same = (u, v) => u.every((x, i) => Math.abs(x - v[i]) < 1e-9);
  function text(x) {
    const abs = Math.abs(x);
    const sign = x < 0 ? "−" : "";
    if (abs < 1e-9) return "0";
    if (Math.abs(abs - 1) < 1e-9) return sign + "1";
    if (Math.abs(abs - 0.5) < 1e-9) return sign + "½";
    if (Math.abs(abs - r) < 1e-9) return sign + "1/√2";
    return sign + String(Number(abs.toFixed(3)));
  }
  const vector = (amps) => `(${amps.map(text).join(", ")})`;

  function mount(el, cfg) {
    let index = 0;
    const picks = { A: null, B: null };
    const title = make("p");
    const rows = make("div");
    const buttons = { A: [], B: [] };
    ["A", "B"].forEach((q) => {
      const row = make("div", "lab-row");
      row.append(make("span", "", `Qubit ${q}:`));
      CHOICES.forEach(([label, key]) => {
        const b = make("button", "", label);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.onclick = () => {
          picks[q] = key;
          buttons[q].forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          fb.textContent = "";
          fb.className = "fb";
        };
        buttons[q].push(b);
        row.append(b);
      });
      rows.append(row);
    });
    const controls = make("div", "lab-row");
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    const add = (label, cls, fn) => {
      const b = make("button", cls, label);
      b.type = "button";
      b.onclick = fn;
      controls.append(b);
      return b;
    };
    const say = (cls, msg) => { fb.className = `fb ${cls}`; fb.textContent = msg; };
    const draw = () => {
      title.textContent = `Target ${index + 1} of ${cfg.targets.length}: ${vector(cfg.targets[index].amps)}`;
      picks.A = picks.B = null;
      [...buttons.A, ...buttons.B].forEach((b) => b.setAttribute("aria-pressed", "false"));
      next.hidden = true;
      check.disabled = none.disabled = false;
    };
    const solved = (msg) => {
      say("good", msg);
      check.disabled = none.disabled = true;
      if (index < cfg.targets.length - 1) next.hidden = false;
      else if (cfg.onSolve) cfg.onSolve();
    };
    const check = add("Check pair", "primary", () => {
      if (!picks.A || !picks.B) return say("bad", "Choose a state for each qubit first.");
      const got = product(real(picks.A), real(picks.B));
      if (same(got, cfg.targets[index].amps)) solved(`Correct. That pair produces ${vector(got)}.`);
      else say("bad", `That pair produces ${vector(got)}, which is not the target.`);
    });
    const none = add("No pair works", "", () => {
      if (cfg.targets[index].impossible) solved("Correct. No choice of separate qubit states can produce this target.");
      else say("bad", "A pair does work for this target. Compare the signs and zeros in each position.");
    });
    const next = add("Next target", "", () => { index += 1; say("", ""); draw(); });
    if (cfg.hint) add("Hint", "", () => say("", cfg.hint));
    el.append(title, rows, controls, fb);
    draw();
  }
  return { mount, product, text };
})();
