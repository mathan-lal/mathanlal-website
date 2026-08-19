// Mathan Lal — shared site behavior
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }
  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  // Portfolio filter (portfolio.html only)
  var filterBtns = document.querySelectorAll('.filter-btn');
  var pfCards = document.querySelectorAll('.pf-card');
  if (filterBtns.length && pfCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        pfCards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          card.style.display = (f === 'all' || cat === f) ? '' : 'none';
        });
      });
    });
  }
  // Simple client-side validation feedback (forms still submit to Netlify)
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#f87171';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
      }
    });
  });
});

// TEMPORARY DEBUG — finds what's causing horizontal scroll on mobile.
// Delete this whole block once the issue is found and fixed.
window.addEventListener('load', function () {
  setTimeout(function () {
    var vw = document.documentElement.clientWidth;
    var offenders = [];
    document.querySelectorAll('*').forEach(function (el) {
      if (el.scrollWidth > vw + 2) {
        offenders.push(
          el.tagName + (el.className ? '.' + String(el.className).replace(/\s+/g, '.') : '') +
          ' → ' + el.scrollWidth + 'px'
        );
      }
    });
    var box = document.createElement('div');
    box.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:red;color:#fff;font-size:11px;padding:8px;max-height:40vh;overflow:auto;';
    box.textContent = 'Viewport: ' + vw + 'px | Offenders: ' + (offenders.length ? offenders.join(' | ') : 'none found');
    document.body.appendChild(box);
  }, 500);
});
