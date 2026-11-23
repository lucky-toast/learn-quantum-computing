// Reusable lab: run one two-qubit circuit on several input states at once.
// Requires product-lab.js and two-qubit-lab.js.
// Goals: {kind: "distinct"} needs every input to give a different certain outcome.
//        {kind: "exact", expect: [i, ...]} needs input n to give outcome expect[n].
// BatchLab.mount(el, {inputs: [{label, amps}], gates, goals: [{kind, expect, text}], maxGates, hint, onSolve})
window.BatchLab = (() => {
  const LABELS = ["00", "01", "10", "11"];
  const run = (names, start) => names.reduce((v, n) => TwoQubitLab.OPS[n](v), start);
  const outcome = (v) => v.findIndex((x) => Math.abs(Math.abs(x) - 1) < 1e-9);

  function check(circuit, inputs, goal) {
    const outcomes = inputs.map((amps) => outcome(run(circuit, amps)));
    const certain = outcomes.every((o) => o >= 0);
    const ok = goal.kind === "exact"
      ? outcomes.every((o, i) => o === goal.expect[i])
      : certain && new Set(outcomes).size === outcomes.length;
    return { outcomes, certain, ok };
  }

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
    let locked = false;
    const max = cfg.maxGates || 8;
    const title = make("p");
    const palette = make("div", "lab-row");
    const wires = make("div", "two-wire");
    wires.setAttribute("aria-label", "Current two-qubit circuit");
    const controls = make("div", "lab-row");
    const table = make("table", "batch-table");
    table.hidden = true;
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    const say = (cls, msg) => { fb.className = `fb ${cls}`.trim(); fb.textContent = msg; };
    const reset = () => { table.hidden = true; table.replaceChildren(); say("", ""); };

    const gateButtons = cfg.gates.map((g) => {
      const b = make("button", "", g);
      b.type = "button";
      b.onclick = () => { circuit.push(g); reset(); drawWires(); };
      palette.append(b);
      return b;
    });
    function drawWires() {
      wires.replaceChildren(make("span", "line", "A ─"), make("span", "line", "B ─"));
      circuit.forEach((g) => {
        const on = (q) => {
          if (g === "CNOT") return make("span", "g ctl", q === "A" ? "●" : "⊕");
          return g.endsWith(q) ? make("span", "g", g[0]) : make("span", "line", "───");
        };
        wires.append(on("A"), on("B"));
      });
      gateButtons.forEach((b) => (b.disabled = locked || circuit.length >= max));
    }
    const add = (label, cls, fn) => {
      const b = make("button", cls, label);
      b.type = "button";
      b.onclick = fn;
      controls.append(b);
      return b;
    };
    function showTable(result) {
      const head = make("tr");
      ["Input", "Output", "Measured"].forEach((h) => head.append(make("th", "", h)));
      const rows = cfg.inputs.map((input, i) => {
        const tr = make("tr");
        const o = result.outcomes[i];
        tr.append(
          make("td", "", input.label),
          make("td", "", vector(run(circuit, input.amps))),
          make("td", o >= 0 ? "" : "uncertain", o >= 0 ? `${LABELS[o]} every time` : "not certain"),
        );
        return tr;
      });
      table.replaceChildren(head, ...rows);
      table.hidden = false;
    }
    const runButton = add("Run on every input", "primary", () => {
      const goal = cfg.goals[index];
      const result = check(circuit, cfg.inputs.map((x) => x.amps), goal);
      showTable(result);
      if (!result.ok) {
        if (!result.certain) return say("bad", "Not yet. At least one input still gives an uncertain outcome.");
        return say("bad", goal.kind === "exact"
          ? "Every outcome is certain, but not every one matches. Compare each row with its marked position."
          : "Every outcome is certain, but two inputs share one. They must all differ.");
      }
      locked = true;
      runButton.disabled = undo.disabled = clear.disabled = true;
      drawWires();
      say("good", `Solved with ${circuit.length} gates: ${circuit.join(", ")}.`);
      if (index < cfg.goals.length - 1) next.hidden = false;
      else if (cfg.onSolve) cfg.onSolve();
    });
    const undo = add("Undo", "", () => { circuit.pop(); reset(); drawWires(); });
    const clear = add("Clear", "", () => { circuit = []; reset(); drawWires(); });
    const next = add("Next goal", "", () => {
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
    function draw() {
      title.innerHTML = "";
      title.append(make("strong", "", `Goal ${index + 1} of ${cfg.goals.length}. `), cfg.goals[index].text);
      drawWires();
    }
    el.append(title, palette, wires, controls, table, fb);
    draw();
  }

  return { mount, run, outcome, check };
})();
