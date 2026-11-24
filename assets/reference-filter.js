// When a reference sheet is embedded in a lesson, hide answers that lesson teaches.
// Tag answers with data-after-lesson="N" to keep them hidden through Lesson N.
(() => {
  const lesson = Number(new URLSearchParams(location.search).get("lesson"));
  if (!lesson) return;
  document.documentElement.classList.add("embedded");
  document.querySelectorAll("[data-after-lesson]").forEach((node) => {
    if (Number(node.dataset.afterLesson) >= lesson) node.hidden = true;
  });
})();
