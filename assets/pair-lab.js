// Reusable "which gate did this?" puzzle for two-qubit states.
// Requires product-lab.js and two-qubit-lab.js.
// PairLab.mount(el, {puzzles: [{from, to}], gates, hint, onSolve})
window.PairLab = (() => {
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const vector = (v) => `(${v.map(ProductLab.text).join(", ")})`;
  const same = (u, v) => u.every((x, i) => Math.abs(x - v[i]) < 1e-9);

  function mount(el, cfg) {
    let index = 0;
    const title = make("p");
    const before = make("div", "", "");
    const after = make("div", "", "");
    const states = make("div", "lab-card");
    states.append(before, after);
    const palette = make("div", "lab-row");
    const controls = make("div", "lab-row");
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    const say = (cls, msg) => { fb.className = `fb ${cls}`; fb.textContent = msg; };
    const gateButtons = cfg.gates.map((gate) => {
      const b = make("button", "", gate);
      b.type = "button";
      b.onclick = () => {
        const puzzle = cfg.puzzles[index];
        const got = TwoQubitLab.OPS[gate](puzzle.from);
        if (!same(got, puzzle.to)) return say("bad", `${gate} gives ${vector(got)}, which is not the After state.`);
        const others = cfg.gates.filter((g) => g !== gate && same(TwoQubitLab.OPS[g](puzzle.from), puzzle.to));
        say("good", others.length
          ? `Correct. ${others.join(" and ")} also works here, which can happen with entangled states.`
          : `Correct. ${gate} produces the After state.`);
        gateButtons.forEach((x) => (x.disabled = true));
        if (index < cfg.puzzles.length - 1) next.hidden = false;
        else if (cfg.onSolve) cfg.onSolve();
      };
      palette.append(b);
      return b;
    });
    const next = make("button", "", "Next puzzle");
    next.type = "button";
    next.hidden = true;
    next.onclick = () => { index += 1; say("", ""); draw(); };
    controls.append(next);
    if (cfg.hint) {
      const hint = make("button", "", "Hint");
      hint.type = "button";
      hint.onclick = () => say("", cfg.hint);
      controls.append(hint);
    }
    const draw = () => {
      const puzzle = cfg.puzzles[index];
      title.textContent = `Puzzle ${index + 1} of ${cfg.puzzles.length}: which single gate did this?`;
      before.textContent = `Before: ${vector(puzzle.from)}`;
      after.textContent = `After: ${vector(puzzle.to)}`;
      next.hidden = true;
      gateButtons.forEach((x) => (x.disabled = false));
    };
    el.append(title, states, palette, controls, fb);
    draw();
  }
  return { mount };
})();
