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

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Валидация
    var isValid = validateName() && validatePhone() && validateFormat();

    if (!isValid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // Показываем состояние отправки
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.innerText;
    submitBtn.innerText = 'Отправка...';
    submitBtn.disabled = true;

    // Собираем данные формы
    var formData = new FormData(form);

    try {
        // Отправляем на Formspree
        var response = await fetch('https://formspree.io/f/xkjnrqwn', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Успешная отправка
            form.hidden = true;
            formSuccess.hidden = false;
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            form.reset();
        } else {
            // Ошибка сервера
            alert('Произошла ошибка при отправке. Пожалуйста, позвоните мне напрямую: +7-930-284-61-71');
        }
    } catch (error) {
        // Сетевая ошибка
        alert('Проблема с соединением. Пожалуйста, позвоните мне напрямую: +7-930-284-61-71');
        console.error('Form submission error:', error);
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
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

// === Расписание из Google Sheets ===
(function() {
    // ID вашей Google Таблицы
    const SHEET_ID = '1KOcwj2PN8qPbTe9Pway_xLGHYf3JBJlJGvPKARLelBE';
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json';

    const scheduleList = document.getElementById('schedule-list');
    const scheduleLoading = document.getElementById('schedule-loading');
    const scheduleError = document.getElementById('schedule-error');

    if (!scheduleList) return;

    // Разбор даты Google: "Date(2026,8,7)" — месяц начинается с 0!
    function parseGvizDate(value) {
        if (!value) return null;
        var str = String(value);
        var m = str.match(/Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
        if (m) {
            return new Date(
                parseInt(m[1], 10),
                parseInt(m[2], 10),
                parseInt(m[3], 10),
                m[4] ? parseInt(m[4], 10) : 0,
                m[5] ? parseInt(m[5], 10) : 0,
                m[6] ? parseInt(m[6], 10) : 0
            );
        }
        var d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    }

    // Разбор времени Google: "Date(1899,11,30,19,0,0)" -> "19:00"
    function formatTime(value) {
        if (!value) return '';
        var str = String(value);
        var m = str.match(/Date\(\d+,\d+,\d+,(\d+),(\d+)/);
        if (m) {
            var h = String(m[1]).padStart(2, '0');
            var min = String(m[2]).padStart(2, '0');
            return h + ':' + min;
        }
        return str; // если время уже текстом "19:00"
    }

    // Формат даты: "7 сентября"
    function formatDate(value) {
        var d = parseGvizDate(value);
        if (!d) return '';
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }

    function getStatusClass(status) {
        if (!status) return 'available';
        if (status.indexOf('Нет мест') !== -1) return 'full';
        if (status.indexOf('Осталось') !== -1) return 'limited';
        return 'available';
    }

    // Показываем только дни занятий
    function isYogaDay(day) {
        return ['Понедельник', 'Среда', 'Пятница'].indexOf(day) !== -1;
    }

    async function loadSchedule() {
        try {
            var response = await fetch(SHEET_URL);
            var text = await response.text();

            var jsonStr = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
            if (!jsonStr) throw new Error('Не удалось распарсить данные');

            var data = JSON.parse(jsonStr[1]);
            var rows = data.table.rows;

            scheduleList.innerHTML = '';
            var hasItems = false;

            rows.forEach(function(row) {
                var dateRaw = row.c[0] && row.c[0].v;
                var day = (row.c[1] && row.c[1].v) || '';
                var timeRaw = row.c[2] && row.c[2].v;
                var status = (row.c[5] && row.c[5].v) || 'Есть места';

                // Пропускаем пустые строки и не-йога дни
                if (!dateRaw || !isYogaDay(day)) return;

                var item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML =
                    '<div class="schedule-date">' + formatDate(dateRaw) + '</div>' +
                    '<div class="schedule-day">' + day + '</div>' +
                    '<div class="schedule-time">' + formatTime(timeRaw) + '</div>' +
                    '<div class="schedule-status ' + getStatusClass(status) + '">' + status + '</div>';

                scheduleList.appendChild(item);
                hasItems = true;
            });

            scheduleLoading.style.display = 'none';

            if (hasItems) {
                scheduleList.style.display = 'grid';
            } else {
                scheduleError.style.display = 'block';
            }
        } catch (error) {
            console.error('Ошибка загрузки расписания:', error);
            scheduleLoading.style.display = 'none';
            scheduleError.style.display = 'block';
        }
    }

    loadSchedule();
})();

