/* ============================================================
   TNT DYNAMICS — script.js
   Mobile nav toggle | Sticky header | Form handler
   ============================================================ */

(function () {
  'use strict';

  // --- Mobile nav toggle ---
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // --- Sticky header shadow on scroll ---
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Smooth scroll for anchor links (fallback for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Contact Form (Formspree AJAX) ---
  /*
   * Formspree integration:
   * 1) Replace the form action URL with your Formspree endpoint:
   *    action="https://formspree.io/f/YOUR_FORM_ID"
   * 2) Submissions are sent via fetch() for a smooth success state.
   * 3) If JS is disabled, the form will still POST normally to Formspree.
   */
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  var errorEl = document.getElementById('form-error');

  if (form && success) {
    form.addEventListener('submit', async function (e) {
      // Basic validation
      var name    = form.querySelector('#fname');
      var contact = form.querySelector('#fcontact');
      var hp      = form.querySelector('input[name="_gotcha"]');

      var valid = true;
      [name, contact].forEach(function (field) {
        if (!field || !field.value.trim()) {
          field.style.borderColor = '#E53E3E';
          field.style.boxShadow   = '0 0 0 3px rgba(229,62,62,0.12)';
          valid = false;
          field.addEventListener('input', function () {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }, { once: true });
        }
      });
      if (!valid) {
        e.preventDefault();
        return;
      }

      // Honeypot filled = likely bot; pretend success but do nothing
      if (hp && hp.value) {
        e.preventDefault();
        form.reset();
        if (errorEl) errorEl.hidden = true;
        success.hidden = false;
        setTimeout(function () { success.hidden = true; }, 6000);
        return;
      }

      var action = form.getAttribute('action') || '';
      // If user hasn't replaced the placeholder, show a helpful error
      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.innerHTML = '<strong>Form not connected yet.</strong> Please update the Formspree URL in <code>index.html</code>, or WhatsApp us.';
        }
        return;
      }

      // Submit via AJAX
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }
      if (errorEl) errorEl.hidden = true;

      try {
        var formData = new FormData(form);
        var res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error('Bad response');

        form.reset();
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(function () { success.hidden = true; }, 6000);
      } catch (err) {
        if (errorEl) errorEl.hidden = false;
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText || 'Send Message';
          submitBtn.disabled = false;
        }
      }
    });
  }

})();
