// postmonster: /networks group filter chips.
(function () {
  var chips = document.querySelectorAll('.filter-chip');
  var groups = document.querySelectorAll('.network-group');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter || 'all';
      chips.forEach(function (c) {
        var active = c === chip;
        c.setAttribute('aria-pressed', String(active));
        c.classList.toggle('bg-ink', active);
        c.classList.toggle('text-paper', active);
        c.classList.toggle('border-ink', active);
        c.classList.toggle('bg-white', !active);
        c.classList.toggle('hover:border-ink', !active);
      });
      groups.forEach(function (g) {
        g.classList.toggle('hidden', filter !== 'all' && g.dataset.group !== filter);
      });
    });
  });
})();
