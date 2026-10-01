// postmonster: sticky header blur on scroll + mobile menu.
(function () {
  var headerBar = document.getElementById('header-bar');
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function onScroll() {
    if (!headerBar) return;
    if (window.scrollY > 8) {
      headerBar.classList.add('bg-paper/85', 'backdrop-blur-md', 'border-paper-line');
      headerBar.classList.remove('border-transparent');
    } else {
      headerBar.classList.remove('bg-paper/85', 'backdrop-blur-md', 'border-paper-line');
      headerBar.classList.add('border-transparent');
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      menu.classList.toggle('hidden', open);
      if (headerBar) headerBar.classList.toggle('bg-paper', !open);
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
