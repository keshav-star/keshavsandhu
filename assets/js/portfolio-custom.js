/* =============================================================
   portfolio-custom.js
   Custom JS for Keshav Sandhu's portfolio.
   Depends on: jQuery, isotope, emailjs (loaded before this file)
   ============================================================= */

/* ------------------------------------------------------------------
   1. EmailJS — contact form
   ------------------------------------------------------------------ */
(function () {
  if (typeof emailjs === 'undefined') return;
  emailjs.init({ publicKey: '7EjtnFEz-7ax6QsuK' });

  function validateForm() {
    var form = document.getElementById('myForm');
    var isValid = true;

    for (var i = 0; i < form.elements.length; i++) {
      var el = form.elements[i];
      if (el.type === 'button' || el.type === 'submit') continue;

      if (!el.checkValidity()) {
        isValid = false;
        el.classList.add('is-invalid');
        var errEl = el.nextElementSibling;
        if (errEl) { errEl.innerHTML = el.validationMessage; errEl.style.display = 'block'; }
      } else {
        el.classList.remove('is-invalid');
        var errEl = el.nextElementSibling;
        if (errEl) { errEl.innerHTML = ''; errEl.style.display = 'none'; }
      }
    }
    return isValid;
  }

  window.sendEmail = function (event) {
    event.preventDefault();
    if (!validateForm()) return;

    var btn = document.querySelector('#myForm button[type="submit"]');
    btn.setAttribute('disabled', 'disabled');

    emailjs.sendForm('service_k99s57e', 'template_2a0tus6', '#myForm')
      .then(function () {
        document.querySelector('.sent-message').style.display = 'block';
        document.getElementById('myForm').reset();
      })
      .catch(function () {
        var errMsg = document.querySelector('.error-message');
        errMsg.innerHTML = 'Error sending email. Please try again later.';
        errMsg.style.display = 'block';
      })
      .finally(function () {
        btn.removeAttribute('disabled');
      });
  };
})();

/* ------------------------------------------------------------------
   2. Sidebar logo animation — divider expand + dot reveal + replay
   ------------------------------------------------------------------ */
(function () {
  var logo    = document.getElementById('sidebar-logo');
  var divider = document.getElementById('logo-divider');
  var dotL    = document.getElementById('logo-dot-l');
  var dotR    = document.getElementById('logo-dot-r');
  if (!logo || !divider) return;

  function revealDivider() {
    setTimeout(function () { divider.style.transform = 'scaleX(1)'; }, 780);
    setTimeout(function () {
      if (dotL) { dotL.style.opacity = '1'; dotL.style.transform = 'scale(1)'; }
      if (dotR) { dotR.style.opacity = '1'; dotR.style.transform = 'scale(1)'; }
    }, 1050);
  }
  revealDivider();

  logo.addEventListener('click', function () {
    logo.style.animation = 'none';
    void logo.offsetWidth;
    logo.style.animation = '';

    divider.style.transition = 'none';
    divider.style.transform  = 'scaleX(0)';
    if (dotL) { dotL.style.transition = 'none'; dotL.style.opacity = '0'; dotL.style.transform = 'scale(0)'; }
    if (dotR) { dotR.style.transition = 'none'; dotR.style.opacity = '0'; dotR.style.transform = 'scale(0)'; }

    void divider.offsetWidth;
    divider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    if (dotL) { dotL.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.8, 0.64, 1), opacity 0.3s ease'; }
    if (dotR) { dotR.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.8, 0.64, 1), opacity 0.3s ease'; }
    revealDivider();
  });
})();

/* ------------------------------------------------------------------
   3. Portfolio enhancements
      - Live project count that updates on filter change
      - Tag chip click → triggers matching isotope filter
   ------------------------------------------------------------------ */
$(document).ready(function () {
  var $portfolioContainer = $('.portfolio-container');
  var $filterBtns         = $('#portfolio-flters li');
  var $countEl            = $('#portfolio-count-num');

  function updateCount() {
    var visible = $portfolioContainer.find('.portfolio-item').not('.isotope-hidden').length;
    $countEl.parent().addClass('count-updating');
    setTimeout(function () {
      $countEl.text(visible);
      $countEl.parent().removeClass('count-updating');
    }, 220);
  }

  // Hook filter-bar clicks to keep the count in sync
  $filterBtns.on('click', function () {
    setTimeout(updateCount, 350);
  });

  // Tag chip click → trigger matching isotope filter
  $(document).on('click', '[data-tag-filter]', function (e) {
    e.stopPropagation();
    var filterValue = $(this).data('tag-filter');

    $filterBtns.removeClass('filter-active');
    $filterBtns.filter('[data-filter="' + filterValue + '"]').addClass('filter-active');

    if ($portfolioContainer.data('isotope')) {
      $portfolioContainer.isotope({ filter: filterValue });
    }

    $('html, body').animate({
      scrollTop: $('#portfolio').offset().top - 60
    }, 400, 'swing');

    setTimeout(updateCount, 350);
  });

  // Initial count
  setTimeout(updateCount, 600);
});
