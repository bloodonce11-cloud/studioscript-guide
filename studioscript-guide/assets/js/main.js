/* StudioScript Guide — JavaScript mínimo, sin dependencias.
   Mejora progresiva: el sitio funciona sin JS; este archivo añade:
   1) menú móvil, 2) buscador y filtro de categorías,
   3) bloques de código (resaltado de Lua + botón copiar), 4) tabla de contenidos activa. */
(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- 1. Menú móvil ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Buscador y filtro de la página de tutoriales ---------- */
  function initTutorialFilter() {
    var grid = document.querySelector('[data-tutorial-grid]');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-live-form]');
    var chipsBox = document.querySelector('[data-chips]');
    var chips = chipsBox ? Array.prototype.slice.call(chipsBox.querySelectorAll('[data-cat]')) : [];
    var status = document.querySelector('[data-search-status]');
    var empty = document.querySelector('[data-empty]');
    var state = { q: '', cat: 'todas' };

    // Valores iniciales desde la URL: ?q=texto&categoria=primeros-pasos
    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      state.q = params.get('q');
      if (input) input.value = state.q;
    }
    var catParam = params.get('categoria');
    if (catParam && chips.some(function (chip) { return chip.getAttribute('data-cat') === catParam; })) {
      state.cat = catParam;
    }

    function render() {
      var terms = normalize(state.q).split(/\s+/).filter(Boolean);
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = normalize((card.getAttribute('data-keywords') || '') + ' ' + card.textContent);
        var matchesCat = state.cat === 'todas' || card.getAttribute('data-category') === state.cat;
        var matchesText = terms.every(function (term) { return haystack.indexOf(term) !== -1; });
        var visible = matchesCat && matchesText;
        card.hidden = !visible;
        if (visible) shown += 1;
      });

      chips.forEach(function (chip) {
        chip.setAttribute('aria-pressed', String(chip.getAttribute('data-cat') === state.cat));
      });

      if (empty) empty.hidden = shown !== 0;
      if (status) {
        var filtering = terms.length > 0 || state.cat !== 'todas';
        status.textContent = filtering
          ? (shown === 1 ? '1 guía encontrada' : shown + ' guías encontradas')
          : '';
      }
    }

    if (form) {
      form.addEventListener('submit', function (event) { event.preventDefault(); });
    }
    if (input) {
      input.addEventListener('input', function () { state.q = input.value; render(); });
    }
    if (chipsBox) {
      chipsBox.hidden = false; // sin JS los botones no tienen función, así que están ocultos
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          state.cat = chip.getAttribute('data-cat');
          render();
        });
      });
    }
    render();
  }

  /* ---------- 3. Bloques de código ---------- */
  var LUA_KEYWORDS = {};
  ('and break do else elseif end false for function if in local nil not or repeat return then true until while')
    .split(' ')
    .forEach(function (word) { LUA_KEYWORDS[word] = true; });

  // Resaltador ligero: comentarios, cadenas, números y palabras clave.
  function highlightLua(source) {
    var pattern = /(--\[\[[\s\S]*?\]\]|--[^\n]*)|("(?:[^"\\\n]|\\[\s\S])*"|'(?:[^'\\\n]|\\[\s\S])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
    var out = '';
    var last = 0;
    var match;

    while ((match = pattern.exec(source)) !== null) {
      out += escapeHtml(source.slice(last, match.index));
      if (match[1] !== undefined) {
        out += '<span class="tok-c">' + escapeHtml(match[1]) + '</span>';
      } else if (match[2] !== undefined) {
        out += '<span class="tok-s">' + escapeHtml(match[2]) + '</span>';
      } else if (match[3] !== undefined) {
        out += '<span class="tok-n">' + escapeHtml(match[3]) + '</span>';
      } else if (LUA_KEYWORDS[match[4]]) {
        out += '<span class="tok-k">' + match[4] + '</span>';
      } else {
        out += escapeHtml(match[4]);
      }
      last = pattern.lastIndex;
    }
    return out + escapeHtml(source.slice(last));
  }

  function copyText(text, onSuccess, onFailure) {
    function fallback() {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
      document.body.removeChild(area);
      if (ok) { onSuccess(); } else { onFailure(); }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess, fallback);
    } else {
      fallback();
    }
  }

  function initCodeBlocks() {
    var codes = document.querySelectorAll('pre > code');
    if (!codes.length) return;

    var live = document.createElement('div');
    live.className = 'sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    var labels = { lua: 'Lua', html: 'HTML', css: 'CSS', js: 'JavaScript', text: 'Texto' };

    Array.prototype.forEach.call(codes, function (code) {
      var pre = code.parentNode;
      if (pre.parentNode.classList.contains('code-block')) return;

      var found = /language-([a-z0-9]+)/.exec(code.className);
      var lang = found ? found[1] : 'text';
      if (lang === 'lua') code.innerHTML = highlightLua(code.textContent);

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      var bar = document.createElement('div');
      bar.className = 'code-block__bar';

      var label = document.createElement('span');
      label.textContent = labels[lang] || lang;

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-btn';
      button.textContent = 'Copiar';
      button.setAttribute('aria-label', 'Copiar código ' + (labels[lang] || lang));

      var timer;
      function flash(text, announcement) {
        button.textContent = text;
        live.textContent = announcement;
        clearTimeout(timer);
        timer = setTimeout(function () { button.textContent = 'Copiar'; live.textContent = ''; }, 2200);
      }

      button.addEventListener('click', function () {
        copyText(
          code.textContent,
          function () { flash('Copiado', 'Código copiado al portapapeles'); },
          function () { flash('No se pudo copiar', 'No se pudo copiar el código'); }
        );
      });

      bar.appendChild(label);
      bar.appendChild(button);
      pre.setAttribute('tabindex', '0'); // permite desplazar con el teclado
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(bar);
      wrapper.appendChild(pre);
    });
  }

  /* ---------- 4. Tabla de contenidos: sección activa ---------- */
  function initToc() {
    var toc = document.querySelector('[data-toc]');
    if (!toc || !('IntersectionObserver' in window)) return;

    var links = {};
    Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (link) {
      links[link.getAttribute('href').slice(1)] = link;
    });

    function setCurrent(id) {
      Object.keys(links).forEach(function (key) {
        if (key === id) { links[key].setAttribute('aria-current', 'true'); }
        else { links[key].removeAttribute('aria-current'); }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

    Object.keys(links).forEach(function (id) {
      var heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    });
  }

  /* ---------- Arranque ---------- */
  function start() {
    initNav();
    initTutorialFilter();
    initCodeBlocks();
    initToc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
