// In-page reference panel for lessons.
// <script src="../assets/reference-drawer.js" data-lesson="4"
//   data-sheets="one-qubit:One qubit,two-qubits:Two qubits"></script>
(() => {
  const script = document.currentScript;
  const lesson = script.dataset.lesson;
  const sheets = script.dataset.sheets.split(",").map((entry) => {
    const [file, label] = entry.split(":");
    return { file, label };
  });
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const urlFor = (sheet) => `../reference/${sheet.file}.html?lesson=${encodeURIComponent(lesson)}`;

  const toggle = make("button", "ref-toggle", "Reference");
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  const drawer = make("aside", "ref-drawer");
  drawer.setAttribute("aria-label", "Reference sheets");
  drawer.hidden = true;
  const header = make("div", "ref-head");
  const tabs = make("div", "ref-tabs");
  const close = make("button", "", "Close");
  close.type = "button";
  const frame = make("iframe");
  frame.title = "Reference sheet";

  const select = (sheet) => {
    frame.src = urlFor(sheet);
    [...tabs.children].forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.file === sheet.file)));
  };
  sheets.forEach((sheet) => {
    const b = make("button", "", sheet.label);
    b.type = "button";
    b.dataset.file = sheet.file;
    b.setAttribute("aria-pressed", "false");
    b.onclick = () => select(sheet);
    tabs.append(b);
  });
  const setOpen = (open) => {
    if (open && !frame.getAttribute("src")) select(sheets[sheets.length - 1]);
    drawer.hidden = !open;
    toggle.hidden = open;
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("ref-open", open);
    (open ? close : toggle).focus();
  };
  toggle.onclick = () => setOpen(true);
  close.onclick = () => setOpen(false);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !drawer.hidden) setOpen(false);
  });
  header.append(tabs, close);
  drawer.append(header, frame);
  document.body.append(toggle, drawer);
})();
