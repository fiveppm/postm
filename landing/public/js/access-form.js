// postmonster: /request-access form — client validation, honeypot, fetch POST
// to ${data-api}/public/access-requests, loading / success / error states.
(function () {
  var form = document.getElementById('access-form');
  var success = document.getElementById('form-success');
  var errorBox = document.getElementById('form-error');
  var statusLive = document.getElementById('form-status');
  var submitBtn = document.getElementById('form-submit');
  if (!form || !success || !errorBox || !submitBtn) return;

  var api = form.dataset.api || '';
  var fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    role: form.querySelector('#role'),
    consent: form.querySelector('#consent'),
  };

  function showError(key, message) {
    var el = form.querySelector('[data-error-for="' + key + '"]');
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('hidden', !message);
  }

  function validate() {
    var ok = true;
    showError('name', '');
    showError('email', '');
    showError('role', '');
    showError('consent', '');

    if (!fields.name.value.trim()) {
      showError('name', 'Please enter your name.');
      ok = false;
    }
    var email = fields.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'Please enter a valid email address.');
      ok = false;
    }
    if (!fields.role.value) {
      showError('role', 'Please choose a role.');
      ok = false;
    }
    if (!fields.consent.checked) {
      showError('consent', 'Please accept the Terms and Privacy Policy.');
      ok = false;
    }
    return ok;
  }

  Object.keys(fields).forEach(function (k) {
    fields[k].addEventListener('input', function () {
      validate();
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorBox.classList.add('hidden');

    if (!validate()) {
      if (statusLive) statusLive.textContent = 'The form has errors.';
      ['name', 'email', 'role', 'consent'].some(function (key) {
        var err = form.querySelector('[data-error-for="' + key + '"]:not(.hidden)');
        if (err) {
          var field = document.getElementById(key);
          if (field) field.focus();
          return true;
        }
        return false;
      });
      return;
    }

    var payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      role: fields.role.value,
      networks: Array.prototype.map.call(
        form.querySelectorAll('input[name="networks"]:checked'),
        function (i) {
          return i.value;
        }
      ),
      teamSize: form.querySelector('#teamSize').value,
      useCase: form.querySelector('#useCase').value.trim(),
      website: form.querySelector('#website').value,
    };

    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-60');
    var label = submitBtn.querySelector('[data-label]');
    if (label) label.textContent = 'Sending…';
    if (statusLive) statusLive.textContent = 'Sending your request.';

    fetch(api + '/public/access-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.status === 429) {
          throw new Error(
            'Too many requests from this connection. Please wait a few minutes and try again.'
          );
        }
        if (!res.ok) {
          throw new Error('The request could not be sent. Please try again in a moment.');
        }

        form.classList.add('hidden');
        success.classList.remove('hidden');
        var heading = document.getElementById('success-heading');
        if (heading) heading.focus();
        if (statusLive) {
          statusLive.textContent = 'Request sent. We will reply within 3 business days.';
        }
      })
      .catch(function (err) {
        var message =
          err && err.message ? err.message : 'Something went wrong. Please try again.';
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
        if (statusLive) statusLive.textContent = message;
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60');
        if (label) label.textContent = 'Send request';
      });
  });
})();
