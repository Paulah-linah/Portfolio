/* Pauline Nafuna — Portfolio. Small, dependency-free behaviour. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");

  // Mobile navigation
  function setNav(open) {
    doc.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setNav(!doc.classList.contains("nav-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  }
  if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });

  // Header border once scrolled
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    return bindForm();
  }

  // Reveal on scroll
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add("in"); revealer.unobserve(entry.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });

  // Highlight the nav link of the section in view
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  if (links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      var section = document.querySelector(a.getAttribute("href"));
      if (section) spy.observe(section);
    });
  }

  bindForm();

  // Contact form (Formspree) without leaving the page
  function bindForm() {
    var form = document.querySelector(".js-contact");
    if (!form || !window.fetch) return;
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      button.disabled = true;
      button.lastChild.textContent = " Sending…";
      status.className = "form-status";
      status.textContent = "";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.className = "form-status ok";
          status.textContent = "Thank you! Your message has been sent. I'll get back to you soon.";
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Something went wrong. Please try again or email me directly.";
        })
        .then(function () {
          button.disabled = false;
          button.lastChild.textContent = " Send message";
        });
    });
  }
})();
