// Shaded drop caps need 9 lines of text beside them (8 for the box, 1 below the
// shadow). When a paragraph ends before the box does, swap in the plain initial
// so the box doesn't leave a hole under the text. Re-checked on resize, since
// the line count depends on the width.
(function () {
  function show(cap, style) {
    cap.textContent = style === "plain" ? cap.dataset.plain : cap.dataset.shadow;
    cap.classList.toggle("dropcap-plain", style === "plain");
    cap.classList.toggle("dropcap-shadow", style === "shadow");
  }

  function fit() {
    document.querySelectorAll(".dropcap[data-plain]").forEach(function (cap) {
      if (!cap.dataset.shadow) cap.dataset.shadow = cap.textContent;
      show(cap, "shadow");
      var p = cap.parentNode;
      var range = document.createRange();
      range.setStartAfter(cap);
      range.setEnd(p, p.childNodes.length);
      var rects = range.getClientRects();
      if (!rects.length) return;
      var textBottom = rects[rects.length - 1].bottom;
      if (textBottom < cap.getBoundingClientRect().bottom - 2) show(cap, "plain");
    });
  }

  var queued;
  function schedule() {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(fit);
  }

  document.addEventListener("DOMContentLoaded", fit);
  window.addEventListener("resize", schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
})();
