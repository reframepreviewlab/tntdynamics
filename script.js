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

  // --- Contact Form (client-side only with success message) ---
  /*
   * TO CONNECT TO A REAL BACKEND:
   * Option A — Formspree:
   *   1. Create account at formspree.io
   *   2. Replace `action="#"` in <form> with action="https://formspree.io/f/YOUR_ID"
   *   3. Add method="POST" to the form
   *   4. Remove or comment out the JS submit handler below.
   *
   * Option B — Netlify Forms:
   *   1. Add `netlify` attribute and `data-netlify="true"` to <form>
   *   2. Deploy via Netlify — it auto-handles submissions.
   */
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      var name    = form.querySelector('#fname');
      var contact = form.querySelector('#fcontact');
      var valid   = true;

      [name, contact].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#E53E3E';
          field.style.boxShadow   = '0 0 0 3px rgba(229,62,62,0.12)';
          valid = false;
          field.addEventListener('input', function () {
            field.style.borderColor = '';
            field.style.boxShadow = '';
          }, { once: true });
        }
      });

      if (!valid) return;

      // Simulate submission (replace with real fetch() call if needed)
      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Hide after 6s
        setTimeout(function () { success.hidden = true; }, 6000);
      }, 800);
    });
  }

})();
