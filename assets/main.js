(function () {
  // Gate JS-only styles so they don't cause flash-of-invisible-content
  document.documentElement.classList.add('js');

  // Project row click delegation (homepage)
  document.querySelectorAll('.project-row').forEach(function (row) {
    var link = row.querySelector('a[href]:not([href="#"])');
    if (!link) return;
    row.classList.add('clickable');
    row.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      if (window.getSelection().toString().length > 0) return;
      window.location.href = link.href;
    });
  });

  // Brand-link smooth-scroll to top (homepage only)
  document.querySelectorAll('.brand-link[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Scroll-spy: highlight nav link whose section the reader is currently in
  (function () {
    var navLinks = Array.from(document.querySelectorAll('.site-header nav a[href*="#"]'));
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (a) {
      var match = a.getAttribute('href').match(/#([^\/]+)$/);
      if (!match) return;
      var el = document.getElementById(match[1]);
      if (el) sections.push({ id: match[1], el: el, link: a });
    });
    if (!sections.length) return;

    function setActive(id) {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      var match = sections.find(function (s) { return s.id === id; });
      if (match) match.link.classList.add('active');
    }

    function update() {
      var triggerLine = window.innerHeight * 0.35;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        var rect = sections[i].el.getBoundingClientRect();
        if (rect.top - triggerLine < 0) {
          current = sections[i].id;
        } else {
          break;
        }
      }
      // Force the last section when we're at the very bottom (handles short final sections)
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // Section fade-up on scroll-in
  (function () {
    if (!('IntersectionObserver' in window)) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = document.querySelectorAll('.case-section, .about, .work, .contact');
    targets.forEach(function (el) { el.classList.add('fade-up'); });

    if (reduced) {
      targets.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  })();
})();
