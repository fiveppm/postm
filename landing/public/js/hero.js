// postmonster: hero interactivity — typing composer, pointer tilt, click-to-drop.
// Vanilla JS, no libraries; everything respects prefers-reduced-motion.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- typing composer caption ---
  var typing = document.getElementById('hero-typing');
  if (typing) {
    var full = typing.dataset.text || '';
    if (reduced) {
      typing.textContent = full;
      typing.classList.add('is-done');
    } else {
      var i = 0;
      var tick = function () {
        i += 1;
        typing.textContent = full.slice(0, i);
        if (i < full.length) {
          window.setTimeout(tick, 22 + (Math.random() * 26 - 10));
        } else {
          typing.classList.add('is-done');
        }
      };
      window.setTimeout(tick, 450);
    }
  }

  // --- pointer tilt on the mockup (desktop only) ---
  var mock = document.getElementById('hero-mock');
  if (mock && !reduced && window.matchMedia('(pointer: fine)').matches) {
    mock.addEventListener('pointermove', function (e) {
      var r = mock.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      mock.style.setProperty('--tilt-y', (px * 4).toFixed(2) + 'deg');
      mock.style.setProperty('--tilt-x', (-py * 3).toFixed(2) + 'deg');
    });
    mock.addEventListener('pointerleave', function () {
      mock.style.setProperty('--tilt-y', '0deg');
      mock.style.setProperty('--tilt-x', '0deg');
    });
  }

  // --- click / keyboard a day slot to drop a demo post ---
  var drops = [
    { title: 'Drop teaser' },
    { title: 'Board refresh' },
    { title: 'Evening digest' },
    { title: 'Shorts cut' },
    { title: 'Quick update' },
  ];
  var times = ['09:30', '11:45', '13:00', '16:20', '18:00'];
  var used = 0;

  var drop = function (zone) {
    if (used >= drops.length) return;
    var spec = drops[used];
    var time = times[used % times.length];
    used += 1;

    var card = document.createElement('article');
    card.className = 'hero-card anim-card rounded-xl border border-ink bg-lime/25 px-2 py-2';
    card.innerHTML =
      '<div class="flex items-center gap-1.5">' +
      '<p class="mono-label text-[9px] text-ink-mute">' +
      time +
      '</p></div>' +
      '<p class="mt-1 truncate text-xs font-semibold leading-snug">' +
      spec.title +
      '</p>' +
      '<p class="mono-label mt-1.5 inline-block rounded-full border border-ink px-1.5 py-0.5 text-[8px] text-ink">Queued</p>';

    zone.parentNode.insertBefore(card, zone);
    if (used >= drops.length) {
      zone.textContent = 'done';
      zone.style.pointerEvents = 'none';
    }
  };

  document.querySelectorAll('[data-drop]').forEach(function (zone) {
    zone.addEventListener('click', function () {
      drop(zone);
    });
    zone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        drop(zone);
      }
    });
  });
})();
