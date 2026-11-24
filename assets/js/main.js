(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-links');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('header-scrolled', window.scrollY > 10);
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  }

  if (header && toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!header.classList.contains('menu-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('click', function (event) {
      if (!header.classList.contains('menu-open')) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100) setMenu(false);
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  var statValues = document.querySelectorAll('.stat-value');

  function renderStat(el, value) {
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var formatted = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('id-ID');
    el.textContent = formatted + suffix;
  }

  function animateStat(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    if (isNaN(target)) return;
    if (reduceMotion) {
      renderStat(el, target);
      return;
    }
    var duration = 1600;
    var startTime = null;
    function tick(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      renderStat(el, target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statValues.forEach(function (el) { statObserver.observe(el); });
  }

  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var button = item.querySelector('.faq-question');
    if (!button) return;
    button.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        var otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && navAnchors.length && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navAnchors.forEach(function (anchor) {
          anchor.classList.toggle('active', anchor.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  var toTop = document.querySelector('.to-top');
  if (toTop) {
    function toggleToTop() {
      toTop.classList.toggle('visible', window.scrollY > 650);
    }
    toggleToTop();
    window.addEventListener('scroll', toggleToTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();
