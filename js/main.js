// Noetra — site JS (nav toggle + lead forms)
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }

  // Mark the current page in the nav
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#site-nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === here || (here === 'index.html' && href === '/')) a.setAttribute('aria-current', 'page');
  });

  // Lead forms → app.gonoetra.ai/api/demo-request
  var ENDPOINT = 'https://app.gonoetra.ai/api/demo-request';
  function wire(form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type=submit]');
    var idle = btn.textContent;
    var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
    var type = form.getAttribute('data-type') || 'call_request';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = get('email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'Please enter a work email.'; status.className = 'form-status form-status-err'; return; }
      if (type === 'call_request' && (!get('name') || !get('company'))) { status.textContent = 'Please add your name and dealership.'; status.className = 'form-status form-status-err'; return; }
      var payload = {
        type: type, name: get('name'), company: get('company'), email: email, phone: get('phone'),
        teamSize: get('teamSize'), stores: get('stores'), industry: get('industry'), crm: get('crm'),
        message: get('message'), website: get('website'), page: location.href
      };
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return r.ok && d.ok; }); })
        .then(function (ok) {
          if (!ok) throw new Error('bad');
          if (window.noetraTrack) window.noetraTrack('lead_submit', { form: type });
          form.querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = true; });
          btn.textContent = 'Received';
          status.textContent = form.getAttribute('data-done') || "Got it. We'll be in touch within one business day.";
          status.className = 'form-status form-status-ok';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = idle;
          status.textContent = 'Something went wrong. Email hello@gonoetra.ai and we’ll take it from there.';
          status.className = 'form-status form-status-err';
        });
    });
  }
  document.querySelectorAll('form[data-lead]').forEach(wire);
})();
