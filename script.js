(function () {
  'use strict';

  /* ===== Mobile menu ===== */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('.nav__link');

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = burger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
      }
    });
  }

  /* ===== Phone mask ===== */
  var phoneInput = document.getElementById('phone');

  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');

    if (digits.charAt(0) === '8') {
      digits = '7' + digits.slice(1);
    }
    if (digits.charAt(0) !== '7' && digits.length > 0) {
      digits = '7' + digits;
    }

    digits = digits.slice(0, 11);

    var result = '';
    if (digits.length > 0) result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) result += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) result += '-' + digits.slice(7, 9);
    if (digits.length >= 9) result += '-' + digits.slice(9, 11);

    return result;
  }

  function getPhoneDigits(value) {
    return value.replace(/\D/g, '');
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var cursorPos = phoneInput.selectionStart;
      var prevLength = phoneInput.value.length;
      phoneInput.value = formatPhone(phoneInput.value);
      var newLength = phoneInput.value.length;
      var newCursor = cursorPos + (newLength - prevLength);
      phoneInput.setSelectionRange(newCursor, newCursor);
    });

    phoneInput.addEventListener('focus', function () {
      if (!phoneInput.value) {
        phoneInput.value = '+7 (';
      }
    });

    phoneInput.addEventListener('blur', function () {
      if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
        phoneInput.value = '';
      }
    });
  }

  /* ===== Form validation ===== */
  var form = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var nameInput = document.getElementById('name');
  var formatSelect = document.getElementById('format');

  function showError(input, errorEl, message) {
    input.classList.add('is-invalid');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('is-invalid');
    errorEl.textContent = '';
  }

  function validateName() {
    var errorEl = document.getElementById('name-error');
    var value = nameInput.value.trim();
    if (!value) {
      showError(nameInput, errorEl, 'Введите ваше имя');
      return false;
    }
    if (value.length < 2) {
      showError(nameInput, errorEl, 'Имя должно содержать минимум 2 символа');
      return false;
    }
    clearError(nameInput, errorEl);
    return true;
  }

  function validatePhone() {
    var errorEl = document.getElementById('phone-error');
    var digits = getPhoneDigits(phoneInput.value);
    if (!digits || digits.length < 11) {
      showError(phoneInput, errorEl, 'Введите корректный номер телефона');
      return false;
    }
    clearError(phoneInput, errorEl);
    return true;
  }

  function validateFormat() {
    var errorEl = document.getElementById('format-error');
    if (!formatSelect.value) {
      showError(formatSelect, errorEl, 'Выберите формат занятия');
      return false;
    }
    clearError(formatSelect, errorEl);
    return true;
  }

  if (form) {
    nameInput.addEventListener('blur', validateName);
    phoneInput.addEventListener('blur', validatePhone);
    formatSelect.addEventListener('change', validateFormat);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = validateName() & validatePhone() & validateFormat();

      if (!isValid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ===== FAQ Accordion ===== */
  var accordionTriggers = document.querySelectorAll('.accordion__trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var panelId = trigger.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);

      accordionTriggers.forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      trigger.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ===== Lightbox ===== */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var certThumbs = document.querySelectorAll('[data-lightbox]');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Сертификат';
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.classList.remove('lightbox-open');
  }

  certThumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var src = thumb.getAttribute('data-lightbox');
      var img = thumb.querySelector('img');
      openLightbox(src, img ? img.alt : '');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
      }
    });
  }
})();
