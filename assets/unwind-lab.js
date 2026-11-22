// Reusable backward-design lab. Requires product-lab.js and two-qubit-lab.js.
// The learner undoes one gate at a time, predicts each new state, and reaches |00⟩.
// All gates offered must be their own inverse.
// UnwindLab.mount(el, {targets: [{amps}], gates, maxSteps, hint, onSolve})
window.UnwindLab = (() => {
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const vector = (v) => `(${v.map(ProductLab.text).join(", ")})`;
  const same = (u, v) => u.every((x, i) => Math.abs(x - v[i]) < 1e-9);
  const sameUpToSign = (u, v) => same(u, v) || same(u, v.map((x) => -x));
  const isStart = (v) => sameUpToSign(v, [1, 0, 0, 0]);
  const shuffle = (list) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  // Wrong options come from other gates, so each one is a plausible slip.
  function optionsFor(state, gate, gates) {
    const right = TwoQubitLab.OPS[gate](state);
    const wrong = [];
    const consider = (v) => {
      if (wrong.length >= 2 || sameUpToSign(v, right)) return;
      if (!wrong.some((w) => sameUpToSign(w, v))) wrong.push(v);
    };
    shuffle(gates.filter((g) => g !== gate)).forEach((g) => consider(TwoQubitLab.OPS[g](state)));
    consider(state);
    right.forEach((_, i) => consider(right.map((x, k) => (k === i ? -x : x))));
    return { right, options: shuffle([right, ...wrong]) };
  }

  function mount(el, cfg) {
    let index = 0;
    let steps = [];
    let pending = null;
    let solved = false;
    const max = cfg.maxSteps || 6;
    const title = make("p");
    const trail = make("ol", "trail");
    trail.setAttribute("aria-label", "States reached while undoing gates");
    const prompt = make("p", "unwind-prompt");
    const palette = make("div", "lab-row");
    const predict = make("div", "quiz-opts");
    const controls = make("div", "lab-row");
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    const say = (cls, msg) => { fb.className = `fb ${cls}`.trim(); fb.textContent = msg; };
    const current = () => (steps.length ? steps[steps.length - 1].state : cfg.targets[index].amps);

    const gateButtons = cfg.gates.map((g) => {
      const b = make("button", "", g);
      b.type = "button";
      b.onclick = () => choose(g);
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
    const back = add("Step back", "", () => { steps.pop(); pending = null; say("", ""); draw(); });
    const restart = add("Restart target", "", () => { steps = []; pending = null; say("", ""); draw(); });
    const next = add("Next target", "primary", () => {
      index += 1;
      steps = [];
      pending = null;
      solved = false;
      say("", "");
      draw();
    });
    if (cfg.hint) add("Hint", "", () => say("", cfg.hint));

    function choose(gate) {
      const { right, options } = optionsFor(current(), gate, cfg.gates);
      pending = { gate, right, options };
      say("", "");
      draw();
    }
    function answer(option, button) {
      if (!same(option, pending.right)) {
        button.classList.add("wrong");
        button.disabled = true;
        say("bad", `Not that one. Apply ${pending.gate} to the current state again, one pair at a time.`);
        return;
      }
      steps.push({ gate: pending.gate, state: pending.right });
      pending = null;
      say("", "");
      if (isStart(current())) finish();
      else if (steps.length >= max) say("bad", "That is the step limit. Step back or restart, and look for a gate that creates more zeros.");
      draw();
    }
    function finish() {
      solved = true;
      const forward = steps.map((s) => s.gate).reverse();
      const out = TwoQubitLab.run(forward);
      const signNote = same(out, cfg.targets[index].amps) ? "" : " It differs from the target only by an overall sign, which no measurement can detect.";
      say("good", `Solved. Read your undo steps in reverse: ${forward.join(", ")}. Run from |00⟩, that circuit gives ${vector(out)}.${signNote}`);
      if (index === cfg.targets.length - 1 && cfg.onSolve) cfg.onSolve();
    }
    function draw() {
      title.textContent = `Target ${index + 1} of ${cfg.targets.length}: ${vector(cfg.targets[index].amps)}`;
      const start = make("li", "", `Target: ${vector(cfg.targets[index].amps)}`);
      trail.replaceChildren(start, ...steps.map((s) => make("li", "", `Undo ${s.gate}: ${vector(s.state)}`)));
      const full = steps.length >= max;
      gateButtons.forEach((b) => {
        b.disabled = solved || full || Boolean(pending);
        b.setAttribute("aria-pressed", String(Boolean(pending) && b.textContent === pending.gate));
      });
      predict.replaceChildren();
      predict.hidden = !pending;
      if (pending) {
        prompt.textContent = `Work it out: what does ${pending.gate} turn the current state into?`;
        pending.options.forEach((option) => {
          const b = make("button", "", vector(option));
          b.type = "button";
          b.onclick = () => answer(option, b);
          predict.append(b);
        });
      } else {
        prompt.textContent = solved ? "" : "Which gate do you undo next?";
      }
      back.disabled = solved || (!steps.length && !pending);
      restart.disabled = solved || (!steps.length && !pending);
      next.hidden = !solved || index >= cfg.targets.length - 1;
    }
    back.onclick = () => {
      if (pending) pending = null;
      else steps.pop();
      say("", "");
      draw();
    };
    el.append(title, trail, prompt, palette, predict, controls, fb);
    draw();
  }
  return { mount };
})();
