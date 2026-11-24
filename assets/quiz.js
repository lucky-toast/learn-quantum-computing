// Reusable immediate-feedback exercises.
// Quiz.choice(el, [{prompt, options, answer, why}])
// Quiz.numeric(el, {fields: [{label, answer}], success, retry, onSolve})
window.Quiz = (() => {
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function choice(el, questions) {
    questions.forEach((q, n) => {
      const box = make("div", "quiz-q");
      box.append(make("p", "", `${n + 1}. ${q.prompt}`));
      const opts = make("div", "quiz-opts");
      const fb = make("div", "fb");
      fb.setAttribute("aria-live", "polite");
      q.options.forEach((label, i) => {
        const b = make("button", "", label);
        b.type = "button";
        b.onclick = () => {
          if (i === q.answer) {
            b.classList.add("right");
            opts.querySelectorAll("button").forEach((x) => (x.disabled = true));
            fb.className = "fb good";
            fb.textContent = q.why;
          } else {
            b.classList.add("wrong");
            b.disabled = true;
            fb.className = "fb bad";
            fb.textContent = "Not quite. Work it out once more.";
          }
        };
        opts.append(b);
      });
      box.append(opts, fb);
      el.append(box);
    });
  }

  function numeric(el, cfg) {
    const row = make("div", "fields");
    const inputs = cfg.fields.map((f) => {
      const label = make("label", "", f.label);
      const input = make("input");
      input.inputMode = "decimal";
      label.append(input);
      row.append(label);
      return input;
    });
    const check = make("button", "primary", "Check");
    check.type = "button";
    row.append(check);
    const fb = make("div", "fb");
    fb.setAttribute("aria-live", "polite");
    check.onclick = () => {
      const ok = inputs.every((input, i) => {
        const text = input.value.trim().replace("−", "-");
        return text !== "" && Math.abs(Number(text) - cfg.fields[i].answer) < 0.01;
      });
      fb.className = ok ? "fb good" : "fb bad";
      fb.textContent = ok ? cfg.success : cfg.retry;
      if (ok && cfg.onSolve) cfg.onSolve();
    };
    el.append(row, fb);
  }

  return { choice, numeric };
})();
