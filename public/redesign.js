/* ============================================================
   Signado redesign, shared site script
   Injects nav + footer (single source of truth) then wires
   all interactions. Include on every page:
     <div data-nav></div> ... <div data-footer></div>
     <script src="/redesign.js"></script>
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Shared NAV markup ----------
     Názvy stránek podle PLAN.md 1.4 (URL zůstávají). Tlačítko v liště
     řídí <body data-cta="demo|zkusit">: demo → Rezervovat demo, jinak
     Vyzkoušet zdarma. */
  var DEMO_URL = '/z/ukazka';
  var ZKUSIT_URL = '/auth/login';
  var ctaDemo = !!(document.body && document.body.getAttribute('data-cta') === 'demo');
  var CTA_HLAVNI = ctaDemo ? [DEMO_URL, 'Rezervovat demo'] : [ZKUSIT_URL, 'Vyzkoušet zdarma'];
  var CTA_DRUHE = ctaDemo ? [ZKUSIT_URL, 'Vyzkoušet zdarma'] : [DEMO_URL, 'Rezervovat demo'];

  /* Menu jako Clustdoc (3. 10. 2026): každá položka Produktu má vlastní stránku,
     Řešení jsou karty oborů s fotkou, Proč Signado sdružuje srovnání, začátek a firmu. */
  var PRODUKT = [
    ['/jak-to-funguje.html', 'Jak to funguje', 'Od odkazu po kompletní podklady'],
    ['/produkt/etapy-zadosti.html', 'Etapy žádosti', 'Další etapa až po kontrole'],
    ['/produkt/sprava-klientu.html', 'Kontrola a připomínky', 'Přijmete, vrátíte s důvodem, připomenete'],
    ['/produkt/klientsky-portal.html', 'Klientský portál', 'Bez účtu, z telefonu, s vaší značkou'],
    ['/produkt/elektronicky-podpis.html', 'Schválení a podpis', 'Konkrétní verze a prostý elektronický podpis'],
    ['/bezpecnost.html', 'Bezpečnost a data', 'Servery v EU, šifrování a export']
  ];
  /* Obory: [stránka, název, věta, barva, ornament]. Každý má vlastní stránku; ornament kreslí CSS (.mega__obor--<ornament>). */
  var RESENI = [
    ['/reseni/ucetni.html', 'Účetní a daňové kanceláře', 'Převzetí nové firmy a měsíční doklady bez shánění.', '#0B8A84', 'doc'],
    ['/reseni/zakazkova-vyroba.html', 'Zakázková výroba a montáž', 'Objednáte, až zákazník schválí přesnou verzi.', '#5B54E0', 'check'],
    ['/reseni/pravnici.html', 'Advokátní kanceláře', 'Spis otevřete, až máte doklady a podepsanou smlouvu.', '#C2366B', 'pen'],
    ['/reseni/hr-a-nabor.html', 'HR a nábor', 'Životopis, certifikáty a souhlas kandidáta jedním odkazem.', '#1F6FD1', 'user'],
    ['/reseni/stavebnictvi.html', 'Stavební firmy', 'Doklady subdodavatelů a zadání stavebníka na jednom místě.', '#A86B12', 'box']
  ];
  var PROC = [
    ['/srovnani.html', 'Signado, nebo e-mail?', 'Kdy e-mail stačí a kdy už ne'],
    ['/caste-otazky.html', 'Časté otázky', 'Účet klienta, připomínky, data, cena'],
    [DEMO_URL, 'Očima klienta', 'Ukázková žádost, na konci objednáte demo']
  ];
  /* Lehká scéna jako u Clustdocu: barevná plocha s ornamenty oboru (kreslí CSS podle třídy). */
  function oborKarta(o){
    return '<a class="mega__obor mega__obor--'+o[4]+'" href="'+o[0]+'" style="--c:'+o[3]+'">' +
      '<span class="mega__obor-scena" aria-hidden="true"></span>' +
      '<b>'+o[1]+'</b><small>'+o[2]+'</small></a>';
  }
  function oborKontakt(){
    return '<a class="mega__obor mega__obor--kontakt" href="/reseni/dalsi-obory.html"><span class="mega__obor-scena" aria-hidden="true">' +
      '<span class="mega__obor-otaznik">?</span></span>' +
      '<b>Nevidíte svůj obor?</b><small>Najdeme řešení spolu, nebo postup nastavíme na míru.</small></a>';
  }
  function sub(l){ return lk(l[0], l[1], l[2]); }
  var IKONY_SLOUPCU = {
    zadost: '<path d="M9 4h6l1 2h3v14H5V6h3z"/><path d="M9 12l2 2 4-4"/>',
    klient: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    proc: '<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/>',
    firma: '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/>'
  };
  /* Sloupec s ikonou u nadpisu (jako Clustdoc). */
  function colI(ikona, title, links){
    return '<div class="mega__col"><p class="mega__col-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IKONY_SLOUPCU[ikona]+'</svg>'+title+'</p>'+links.join('')+'</div>';
  }
  /* Zvýrazněná karta vpravo: odkaz na jednu stránku, která v sloupcích není. */
  function hlavniKarta(href, kicker, nadpis, text, scena){
    return '<a class="mega__hlavni" href="'+href+'"><span class="mega__hlavni-scena" aria-hidden="true">'+scena+'</span>' +
      '<small class="mega__hlavni-k">'+kicker+'</small><b>'+nadpis+' →</b><span>'+text+'</span></a>';
  }
  var SCENA_KROKY = '<span class="mk"><i style="--c:#5B54E0">1</i>Odkaz</span><span class="mk"><i style="--c:#1F6FD1">2</i>Klient vyplní</span><span class="mk"><i style="--c:#0B8A84">3</i>Kontrola</span><span class="mk"><i style="--c:#017737">✓</i>Hotovo</span>';
  var SCENA_TELEFON = '<span class="mt"><span class="mt__l">Účetní kancelář Mochnová</span><span class="mt__p"><i></i></span><span class="mt__r">Výpis z účtu<em>Hotovo</em></span><span class="mt__r">Faktury za září<em class="v">Vráceno</em></span></span>';

  var NAV_HTML =
  '<nav class="nav" id="nav"><div class="container nav__inner">' +
    '<a href="/" class="nav__brand"><img src="/assets/brand/signado-full-black.svg?v=2" alt="Signado" class="nav__logo"></a>' +
    '<ul class="nav__list">' +
      navMega('Produkt', [
        colI('zadost', 'Žádost', [sub(PRODUKT[1]), sub(PRODUKT[2]), sub(PRODUKT[4])]),
        colI('klient', 'Klient a data', [sub(PRODUKT[3]), sub(PRODUKT[5])]),
        hlavniKarta(PRODUKT[0][0], 'Začněte tady', PRODUKT[0][1], 'Od odkazu po kompletní podklady ve čtyřech krocích.', SCENA_KROKY)
      ], '', 'produkt') +
      navMega('Řešení', RESENI.map(oborKarta).concat([oborKontakt()]), '', 'reseni') +
      navMega('Proč Signado', [
        colI('proc', 'Proč Signado', [sub(PROC[0]), sub(PROC[1])]),
        colI('firma', 'Společnost', [lk('/o-nas.html', 'O nás', 'Kdo za Signadem stojí'), lk('/blog/', 'Blog', 'Články o podkladech a podpisu'), lk('/kontakt.html', 'Kontakt', 'Odpovídáme česky')]),
        hlavniKarta(PROC[2][0], 'Vyzkoušejte', PROC[2][1], 'Projděte si ukázkovou žádost jako váš klient. Na konci objednáte demo.', SCENA_TELEFON)
      ], '', 'proc') +
      '<li class="nav__item"><a class="nav__plain" href="/cenik.html">Ceník</a></li>' +
    '</ul>' +
    '<span class="nav__spacer"></span>' +
    '<div class="nav__actions">' +
      '<form class="nav__search" id="nav-search" role="search" action="/index.html">' +
        '<button type="button" class="nav__icon-btn nav__search-toggle" id="nav-search-btn" aria-label="Hledat na webu" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
        '</button>' +
        '<input class="nav__search-input" id="nav-search-input" type="search" placeholder="Hledat" autocomplete="off" tabindex="-1">' +
        '<button type="button" class="nav__search-close" id="nav-search-close" aria-label="Zavřít hledání">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</form>' +
      '<div class="nav__lang" id="nav-lang">' +
        '<button class="nav__icon-btn nav__lang-btn" id="nav-lang-btn" aria-label="Změnit jazyk" aria-expanded="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>' +
          '<svg class="nav__lang-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>' +
        '</button>' +
        '<div class="nav__lang-menu" id="nav-lang-menu" role="menu">' +
          '<button class="nav__lang-opt is-active" role="menuitem" data-lang="cs">Čeština</button>' +
          '<button class="nav__lang-opt" role="menuitem" data-lang="en">English</button>' +
        '</div>' +
      '</div>' +
      '<a href="' + ZKUSIT_URL + '" class="btn btn--ghost nav__login">Přihlásit se</a>' +
      '<a href="' + CTA_HLAVNI[0] + '" class="btn btn--primary nav__cta-desktop">' + CTA_HLAVNI[1] + '</a>' +
      '<button class="nav__burger" id="nav-burger" aria-label="Otevřít menu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
    '</div>' +
  '</div></nav>' +
  '<div class="drawer" id="drawer">' +
    drawerGroup('Produkt', PRODUKT) +
    drawerGroup('Řešení', RESENI.map(function (l) { return [l[0], l[1]]; })) +
    drawerGroup('Proč Signado', PROC.map(function (l) { return [l[0], l[1]]; }).concat([['/o-nas.html','O nás'],['/blog/','Blog'],['/kontakt.html','Kontakt']])) +
    '<div class="drawer__group"><button class="drawer__gtoggle" onclick="location.href=\'/cenik.html\'">Ceník</button></div>' +
    '<div class="drawer__cta"><a href="' + ZKUSIT_URL + '" class="btn btn--outline">Přihlásit se</a><a href="' + CTA_HLAVNI[0] + '" class="btn btn--primary" style="margin-top:12px;">' + CTA_HLAVNI[1] + '</a><a href="' + CTA_DRUHE[0] + '" class="btn btn--secondary" style="margin-top:12px;">' + CTA_DRUHE[1] + '</a></div>' +
  '</div>';

  function lk(href, label, sub){
    if (sub) return '<a class="mega__link mega__link--sub" href="'+href+'"><span class="arr">→</span><span><b>'+label+'</b><small>'+sub+'</small></span></a>';
    return '<a class="mega__link" href="'+href+'"><span class="arr">→</span> '+label+'</a>';
  }
  function megaFoot(text, links){
    var a = links.map(function (l) { return '<a class="mega__foot-cta" href="'+l[0]+'">'+l[1]+' →</a>'; }).join('');
    return '<div class="mega__foot"><div class="mega__foot-inner"><span>'+text+'</span>'+a+'</div></div>';
  }
  function seeall(href, label){ return '<a class="mega__seeall" href="'+href+'">'+label+' →</a>'; }
  function col(title, links){ return '<div class="mega__col"><p class="mega__col-title">'+title+'</p>'+links.join('')+'</div>'; }
  function chev(){ return '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'; }
  function navMega(label, cols, foot, mod){
    return '<li class="nav__item" data-mega><button class="nav__trigger" aria-expanded="false" aria-haspopup="true">'+label+chev()+'</button>' +
      '<div class="mega'+(mod ? ' mega--'+mod : '')+'"><div class="mega__inner">'+cols.join('')+'</div>'+(foot||'')+'</div></li>';
  }
  function drawerGroup(title, links){
    var inner = links.map(function(l){ return '<a href="'+l[0]+'">'+l[1]+'</a>'; }).join('');
    return '<div class="drawer__group"><button class="drawer__gtoggle">'+title+chev()+'</button><div class="drawer__links">'+inner+'</div></div>';
  }

  /* ---------- Shared FOOTER markup ---------- */
  var FOOTER_HTML =
  '<footer class="footer"><div class="container">' +
    '<div class="footer__grid">' +
      '<div class="footer__brand">' +
        '<a href="/" class="footer__logo"><img src="/assets/brand/signado-full-black.svg?v=2" alt="Signado" style="height:34px;width:auto;"></a>' +
        '<p>Podklady od klientů jedním odkazem. Kontrola po položkách, automatické připomínky a vaše značka. Pro české firmy.</p>' +
        '<div class="footer__social">' +
          '<a href="https://linkedin.com/company/signado" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>' +
          '<a href="https://x.com/signado_cz" aria-label="X"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>' +
        '</div>' +
      '</div>' +
      fcol('Produkt', PRODUKT.concat([['/cenik.html','Ceník']])) +
      fcol('Řešení', RESENI.map(function (l) { return [l[0], l[1]]; })) +
      fcol('Proč Signado', PROC.map(function (l) { return [l[0], l[1]]; }).concat([['/o-nas.html','O nás'],['/blog/','Blog'],['/kontakt.html','Kontakt']])) +
      fcol('Právní', [['/podminky-pouziti.html','Podmínky použití'],['/ochrana-osobnich-udaju.html','Ochrana osobních údajů'],['/ochrana-osobnich-udaju.html#cookies','Cookies']]) +
    '</div>' +
    '<div class="footer__bottom"><span>© 2026 Signado. Provozováno v Česku 🇨🇿</span><span class="spacer"></span><a href="mailto:ahoj@signado.cz">ahoj@signado.cz</a></div>' +
  '</div></footer>';

  function fcol(title, links){
    var inner = links.map(function(l){ return '<a href="'+l[0]+'">'+l[1]+'</a>'; }).join('');
    return '<div class="footer__col"><div class="footer__col-title">'+title+'</div>'+inner+'</div>';
  }

  /* ---------- Inject shared components ---------- */
  var navMount = document.querySelector('[data-nav]');
  if (navMount) navMount.outerHTML = NAV_HTML;
  var footMount = document.querySelector('[data-footer]');
  if (footMount) footMount.outerHTML = FOOTER_HTML;

  /* ============================================================
     ADRESA APLIKACE  <<< PRO VÝVOJÁŘE: MĚNÍ SE JEN TADY >>>
     ------------------------------------------------------------
     Všechna tlačítka "Vyzkoušet zdarma" a "Přihlásit se" vedou do
     aplikace. V HTML je u nich napsaná produkční adresa (APP_ORIGIN),
     takže stránky dávají smysl i bez JavaScriptu. Tenhle blok ji pak
     za běhu přepíše na to, co odpovídá prostředí.

     Nastavte APP_ORIGIN na adresu, kde aplikace opravdu běží.
     Pozn.: subdoména app.signado.cz zatím neexistuje, proto odkazy
     míří na produkční adresu aplikace na Vercelu. Po připojení domény
     stačí nahradit adresu tady i v HTML (najít a nahradit).
     ============================================================ */
  Array.prototype.forEach.call(
    document.querySelectorAll('a[href^="https://signado-frontend-three.vercel.app"]'),
    function (a) {
      a.setAttribute(
        'href',
        a.getAttribute('href').replace('https://signado-frontend-three.vercel.app', '')
      );
    }
  );

  /* ============================================================
     INTERACTIONS
     ============================================================ */
  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('is-stuck', window.scrollY > 4); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mega menu */
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item[data-mega]'));
  var closeTimer = null;
  function closeAll(except) {
    items.forEach(function (it) {
      if (it !== except) {
        it.classList.remove('is-open');
        var t = it.querySelector('.nav__trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  }
  function openItem(it) {
    clearTimeout(closeTimer); closeAll(it); it.classList.add('is-open');
    var t = it.querySelector('.nav__trigger'); if (t) t.setAttribute('aria-expanded', 'true');
  }
  function scheduleClose() { clearTimeout(closeTimer); closeTimer = setTimeout(function () { closeAll(null); }, 140); }
  items.forEach(function (it) {
    var trigger = it.querySelector('.nav__trigger');
    it.addEventListener('mouseenter', function () { openItem(it); });
    it.addEventListener('mouseleave', scheduleClose);
    if (trigger) trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (it.classList.contains('is-open')) closeAll(null); else openItem(it);
    });
  });
  document.querySelectorAll('.mega').forEach(function (m) {
    m.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    m.addEventListener('mouseleave', scheduleClose);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav__item[data-mega]')) closeAll(null); });

  /* Mobile drawer */
  var burger = document.getElementById('nav-burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('.drawer__gtoggle').forEach(function (btn) {
      btn.addEventListener('click', function () { if (btn.nextElementSibling) btn.parentElement.classList.toggle('is-open'); });
    });
    drawer.querySelectorAll('.drawer__links a, .drawer__cta a').forEach(function (a) {
      a.addEventListener('click', function () { drawer.classList.remove('is-open'); document.body.style.overflow = ''; });
    });
  }

  /* Hero underline draw */
  function drawUnderline() { document.querySelectorAll('.hero__uline').forEach(function (el) { el.classList.add('is-drawn'); }); }
  if (document.readyState === 'complete') requestAnimationFrame(drawUnderline);
  else window.addEventListener('load', function () { setTimeout(drawUnderline, 120); });

  /* ── Hledání v liště ────────────────────────────────────────────────
     Malé tlačítko se po kliknutí rozbalí v pole přes celou lištu,
     zvýrazní se a zbytek lišty zbledne – ať je jasné, kde teď jste. */
  (function navSearch() {
    var nav = document.getElementById('nav');
    var btn = document.getElementById('nav-search-btn');
    var form = document.getElementById('nav-search');
    var input = document.getElementById('nav-search-input');
    var close = document.getElementById('nav-search-close');
    if (!nav || !btn || !form || !input) return;

    function open() {
      nav.classList.add('is-searching');
      btn.setAttribute('aria-expanded', 'true');
      setTimeout(function () { input.focus(); }, 60);
    }
    function shut() {
      nav.classList.remove('is-searching');
      btn.setAttribute('aria-expanded', 'false');
      input.value = '';
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      nav.classList.contains('is-searching') ? shut() : open();
    });
    if (close) close.addEventListener('click', shut);
    form.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () {
      if (nav.classList.contains('is-searching')) shut();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
      // Lomítko otevře hledání, pokud uživatel zrovna nepíše jinam.
      if (e.key === '/' && document.activeElement === document.body) {
        e.preventDefault();
        open();
      }
    });
  })();

  /* ── Přepínač jazyka ───────────────────────────────────────────────── */
  (function navLang() {
    var wrap = document.getElementById('nav-lang');
    var btn = document.getElementById('nav-lang-btn');
    if (!wrap || !btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    wrap.querySelectorAll('.nav__lang-opt').forEach(function (o) {
      o.addEventListener('click', function () {
        wrap.querySelectorAll('.nav__lang-opt').forEach(function (x) { x.classList.remove('is-active'); });
        o.classList.add('is-active');
        wrap.classList.remove('is-open');
      });
    });
  })();

  /* FAQ accordion (supports new .faq__q and legacy .faq__question) */
  document.querySelectorAll('.faq__item, .payfaq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q, .faq__question, .payfaq__q');
    var a = item.querySelector('.faq__a, .faq__answer, .payfaq__a');
    if (!q) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      // Otázky se navzájem nezavírají – čtenář si jich může nechat otevřených víc.
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      // Animace na skutečnou výšku. Pevná max-height nechá krátké odpovědi
      // čekat, než "dojede" nastavený limit, což vypadá jako seknutí.
      if (a) a.style.maxHeight = open ? a.scrollHeight + 'px' : '';
    });
  });
  // Po změně šířky okna přepočítat otevřené odpovědi.
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq__item.is-open, .payfaq__item.is-open').forEach(function (item) {
      var a = item.querySelector('.faq__a, .faq__answer, .payfaq__a');
      if (a) a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  /* Before / After compare slider */
  (function () {
    var box = document.getElementById('compare');
    var handle = document.getElementById('compare-handle');
    var after = document.getElementById('compare-after');
    if (!box || !handle || !after) return;
    var dragging = false;
    function setPos(clientX) {
      var r = box.getBoundingClientRect();
      var x = Math.max(0, Math.min(r.width, clientX - r.left));
      var pct = (x / r.width) * 100;
      handle.style.left = pct + '%';
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
    }
    function down(e) { dragging = true; handle.style.transition = 'none'; var t = e.touches && e.touches[0]; setPos(t ? t.clientX : e.clientX); }
    function move(e) { if (!dragging) return; var t = e.touches && e.touches[0]; setPos(t ? t.clientX : e.clientX); }
    function up() { dragging = false; handle.style.transition = ''; }
    box.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    box.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', up);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(box);
          var pct = 50, dir = 1, steps = 0;
          var wig = setInterval(function () {
            pct += dir * 1.4;
            if (pct > 60) dir = -1;
            if (pct < 40) dir = 1;
            handle.style.left = pct + '%';
            after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
            if (++steps > 34) { clearInterval(wig); handle.style.left = '50%'; after.style.clipPath = 'inset(0 0 0 50%)'; }
          }, 28);
        });
      }, { threshold: 0.4 });
      io.observe(box);
    }
  })();

  /* Pricing calculator */
  (function () {
    var slider = document.getElementById('calc-slider');
    var lbl = document.getElementById('calc-count-label');
    var val = document.getElementById('calc-count-value');
    var hoursEl = document.getElementById('calc-hours');
    var moneyEl = document.getElementById('calc-money');
    if (!slider || !hoursEl || !moneyEl) return;
    var MIN = 30, RATE = 500;
    function update() {
      var n = parseInt(slider.value, 10) || 0;
      var hours = (n * MIN) / 60, money = hours * RATE;
      if (lbl) lbl.textContent = n;
      if (val) val.textContent = n;
      hoursEl.textContent = hours.toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) + ' h';
      moneyEl.textContent = Math.round(money).toLocaleString('cs-CZ') + ' Kč';
    }
    slider.addEventListener('input', update);
    update();
  })();

  /* Waitlist / contact forms */
  document.querySelectorAll('form.js-waitlist, #waitlist-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.parentElement.querySelector('.js-waitlist-ok');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function () {
          form.reset();
          if (ok) ok.classList.add('show');
          else { form.innerHTML = '<p style="font-weight:600;color:var(--sg-green);">Díky! Ozveme se vám na e-mail.</p>'; }
        })
        .catch(function () { if (ok) ok.classList.add('show'); });
    });
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io2.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io2.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Přepínač "Kde jste teď" ───────────────────────────────────────── */
  (function audienceSwitcher() {
    var tabs = document.querySelectorAll('.switcher__tab');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-tab');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        document.querySelectorAll('.switcher__panel').forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-panel') === key);
        });
      });
    });
  })();


  /* ── Hlavní strana na jednu obrazovku ───────────────────────────────
     Hero se dopočítá tak, aby pruh "Postaveno pro české firmy" seděl
     přesně na spodní hranu okna. Bez toho stránka působí jako
     "jedna a čtvrt obrazovky" a láká ke scrollu, kde nic není.
     Počítá se z reálných výšek, ne z odhadu – jinak by to lezlo
     při jiném zoomu, fontu nebo delším textu. */
  (function fitHeroToViewport() {
    var hero = document.querySelector('.hero');
    var trust = document.querySelector('.trust');
    if (!hero || !trust) return;

    function fit() {
      // Na úzkých displejích dává větší smysl přirozená výška.
      if (window.innerWidth < 900) {
        hero.style.minHeight = '';
        return;
      }
      var nav = document.querySelector('.nav');
      var navH = nav ? nav.getBoundingClientRect().height : 0;
      var trustH = trust.getBoundingClientRect().height;
      var space = window.innerHeight - navH - trustH;
      hero.style.minHeight = Math.max(space, 460) + 'px';
    }

    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  })();


  /* ── Zarovnání rozbalovacího menu ──────────────────────────────────
     Menu jde přes celou šířku, ale jeho obsah má začínat tam, kde
     začínají odkazy v liště – ne až u loga, kde působil odtržený. */
  (function alignMega() {
    var nav = document.querySelector('.nav');
    var logo = document.querySelector('.nav__logo, .nav__brand img');
    if (!nav || !logo) return;
    // Písmeno "d" ve slově signado začíná na 116 z 645 jednotek šířky loga
    // (změřeno z jeho SVG). Držíme poměr, ne pevný pixel – přežije to
    // změnu velikosti loga i odsazení lišty.
    var D_RATIO = 116 / 145;
    function align() {
      var r = logo.getBoundingClientRect();
      if (!r.width) return;
      nav.style.setProperty('--mega-offset', Math.round(r.left + r.width * D_RATIO) + 'px');
    }
    align();
    window.addEventListener('resize', align);
    window.addEventListener('load', align);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    if (!logo.complete) logo.addEventListener('load', align);
  })();


  /* ── Úvodní stránka: postup 01–04 v záložkách ──────────────────────
     Vlevo kroky, vpravo snímek. Klik nebo šipky nahoru/dolů. */
  (function hpPostup() {
    document.querySelectorAll('[data-hp-tabs]').forEach(function (box) {
      var tabs = box.querySelectorAll('[data-hp-tab]');
      var panes = box.querySelectorAll('[data-hp-pane]');
      function show(key) {
        tabs.forEach(function (t) {
          var on = t.getAttribute('data-hp-tab') === key;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        });
        panes.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-hp-pane') === key); });
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { show(t.getAttribute('data-hp-tab')); });
        t.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var n = tabs[(i + d + tabs.length) % tabs.length];
          show(n.getAttribute('data-hp-tab')); n.focus();
        });
      });
    });
  })();

  /* ── Parallax skvrn za obrázky ─────────────────────────────────────
     Jako Content Snare: skvrna jede při scrollu pomaleji než obsah.
     data-parallax = rychlost (0.15 = o 15 % výšky okna na průjezd). */
  (function hpParallax() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 kolem středu okna
        el.style.transform = 'translate3d(0,' + (p * parseFloat(el.getAttribute('data-parallax')) * vh).toFixed(1) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ── Obrazová místa v2 (.hp-vizual) ──────────────────────────────
     Vizuály dodávají souběžně jiní agenti. Dokud WEBP chybí, schová se
     rozbitý obrázek a zůstane levandulový panel se stejným rozměrem.
     Chyba obrázku nebublá, proto posluchač ve fázi zachycení; obrázky,
     které selhaly dřív, než se skript načetl, najde kontrola complete. */
  (function hpVizualy() {
    function chybi(img) {
      var f = img.closest && img.closest('.hp-vizual');
      if (f) f.classList.add('is-chybi');
    }
    document.addEventListener('error', function (e) {
      if (e.target && e.target.tagName === 'IMG') chybi(e.target);
    }, true);
    document.addEventListener('load', function (e) {
      var t = e.target;
      if (t && t.tagName === 'IMG' && t.naturalWidth) {
        var f = t.closest && t.closest('.hp-vizual');
        if (f) f.classList.remove('is-chybi');
      }
    }, true);
    document.querySelectorAll('.hp-vizual img').forEach(function (img) {
      if (img.complete && !img.naturalWidth) chybi(img);
    });
  })();

  /* ---------- Přehrávač ukázky (index, sekce Jak to funguje) ----------
     Video se stáhne až po kliknutí. Pak dostane ovládání prohlížeče,
     po skončení se vrátí na plakát s tlačítkem. */
  document.querySelectorAll('[data-prehravac]').forEach(function (box) {
    var video = box.querySelector('video');
    var tlacitko = box.querySelector('.hp-prehravac__play');
    if (!video || !tlacitko) return;
    tlacitko.addEventListener('click', function () {
      video.setAttribute('controls', '');
      video.muted = true; /* video nemá zvukovou stopu; ztlumené se spustí vždy */
      box.classList.add('je-spusteno');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      video.focus();
    });
    video.addEventListener('ended', function () {
      video.removeAttribute('controls');
      box.classList.remove('je-spusteno');
      video.load();
      tlacitko.focus();
    });
  });

  /* ---------- Přepínač příkladů průběhu (stránka Etapy žádosti) ----------
     [data-prubeh] obsahuje záložky [role=tab] a panely [role=tabpanel].
     Klik nebo šipky vlevo/vpravo přepnou příklad; ostatní přepínače na stránce neovlivní. */
  document.querySelectorAll('[data-prubeh]').forEach(function (box) {
    var taby = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    var panely = Array.prototype.slice.call(box.querySelectorAll('[role="tabpanel"]'));
    function vyber(i, fokus) {
      taby.forEach(function (t, j) {
        var on = j === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      panely.forEach(function (p, j) { p.classList.toggle('is-active', j === i); p.hidden = j !== i; });
      if (fokus) taby[i].focus();
    }
    taby.forEach(function (t, i) {
      t.addEventListener('click', function () { vyber(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); vyber((i + 1) % taby.length, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); vyber((i - 1 + taby.length) % taby.length, true); }
      });
    });
    vyber(0);
  });

  /* ---------- Blog (3. 10. 2026) ----------
     Pruh čtení nahoře, zvýraznění kapitoly v obsahu po straně a filtr témat v přehledu
     (kotva #tema-podpis / #tema-podklady otevře přehled rovnou na tématu). */
  var postup = document.querySelector('.cl-postup i');
  var textClanku = document.querySelector('.cl-text');
  if (postup && textClanku) {
    var tik = false;
    var obnov = function () {
      var r = textClanku.getBoundingClientRect();
      var cela = r.height - window.innerHeight * 0.6;
      var p = cela > 0 ? Math.min(1, Math.max(0, -r.top / cela)) : 0;
      postup.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      tik = false;
    };
    window.addEventListener('scroll', function () { if (!tik) { tik = true; requestAnimationFrame(obnov); } }, { passive: true });
    obnov();
  }
  var odkazyObsahu = Array.prototype.slice.call(document.querySelectorAll('.cl-obsah a[href^="#"]'));
  if (odkazyObsahu.length) {
    var kapitoly = odkazyObsahu.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var aktivni = null, tik2 = false;
    var zvyrazni = function () {
      var hranice = window.innerHeight * 0.3, vybrany = null;
      kapitoly.forEach(function (h, i) { if (h && h.getBoundingClientRect().top <= hranice) vybrany = odkazyObsahu[i]; });
      if (vybrany !== aktivni) {
        if (aktivni) aktivni.classList.remove('is-active');
        if (vybrany) vybrany.classList.add('is-active');
        aktivni = vybrany;
      }
      tik2 = false;
    };
    window.addEventListener('scroll', function () { if (!tik2) { tik2 = true; requestAnimationFrame(zvyrazni); } }, { passive: true });
    zvyrazni();
  }
  var filtry = Array.prototype.slice.call(document.querySelectorAll('.bl-filtr'));
  var karty = Array.prototype.slice.call(document.querySelectorAll('[data-bl-mrizka] .bl-karta'));
  if (filtry.length && karty.length) {
    var filtruj = function (kat) {
      filtry.forEach(function (f) {
        var on = f.getAttribute('data-filtr') === kat;
        f.classList.toggle('is-active', on);
        f.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      karty.forEach(function (k) { k.hidden = !!kat && k.getAttribute('data-kat') !== kat; });
    };
    filtry.forEach(function (f) {
      f.addEventListener('click', function () {
        var kat = f.getAttribute('data-filtr');
        filtruj(kat);
        try { history.replaceState(null, '', kat ? '#tema-' + kat : location.pathname); } catch (e) {}
      });
    });
    var zHashe = (location.hash.match(/^#tema-([a-z]+)$/) || [])[1] || '';
    filtruj(filtry.some(function (f) { return f.getAttribute('data-filtr') === zHashe; }) ? zHashe : '');
  }

  /* Posuvníky ušetřeného času a peněz (článek Kolik času stojí shánění podkladů).
     Dnes: klienti × minuty dnes; se Signadem: klienti × 8,5 min (model v článku); obojí × cena hodiny.
     Čistá úspora = rozdíl − cena vybraného tarifu (měsíčně bez DPH). */
  document.querySelectorAll('[data-kalkulacka2]').forEach(function (k) {
    var PAK = 8.5;
    var vstupy = {};
    k.querySelectorAll('input[data-k]').forEach(function (i) { vstupy[i.getAttribute('data-k')] = i; });
    var tarify = Array.prototype.slice.call(k.querySelectorAll('[data-tarif]'));
    var v = function (n) { return k.querySelector('[data-v="' + n + '"]'); };
    var out = function (n) { return k.querySelector('[data-out="' + n + '"]'); };
    var cz = function (x, des) { return x.toLocaleString('cs-CZ', { maximumFractionDigits: des || 0, minimumFractionDigits: 0 }); };
    var kc = function (x) { return cz(Math.round(x / 10) * 10) + ' Kč'; };
    var hod = function (x) { return cz(Math.round(x * 10) / 10, 1) + ' h'; };
    var tarif = tarify.filter(function (t) { return t.classList.contains('is-active'); })[0] || tarify[0];
    var spocti = function () {
      var kl = +vstupy.klienti.value, dnes = +vstupy.dnes.value, sazba = +vstupy.sazba.value;
      Object.keys(vstupy).forEach(function (n) {
        var i = vstupy[n];
        i.style.setProperty('--p', ((i.value - i.min) / (i.max - i.min) * 100).toFixed(1) + '%');
      });
      out('klienti').textContent = cz(kl);
      out('dnes').textContent = cz(dnes) + ' min';
      out('sazba').textContent = cz(sazba) + ' Kč';
      var hDnes = kl * dnes / 60, hPak = kl * PAK / 60, hUspora = Math.max(0, hDnes - hPak);
      var cena = +tarif.getAttribute('data-tarif'), nazev = tarif.getAttribute('data-nazev');
      v('dnes-kc').textContent = kc(hDnes * sazba);
      v('dnes-vzorec').textContent = cz(kl) + ' klientů × ' + cz(dnes) + ' min = ' + hod(hDnes) + ' × ' + cz(sazba) + ' Kč';
      v('pak-kc').textContent = kc(hPak * sazba);
      v('pak-vzorec').textContent = cz(kl) + ' klientů × 8,5 min = ' + hod(hPak) + ' × ' + cz(sazba) + ' Kč';
      v('uspora-kc').textContent = kc(hUspora * sazba);
      v('uspora-h').textContent = hod(hUspora) + ' práce';
      var cista = hUspora * sazba - cena;
      v('cista').textContent = cista >= 0 ? 'Po zaplacení tarifu ' + nazev + ' zůstane ' + kc(cista)
                                          : 'Úspora zatím nepokryje tarif ' + nazev + ' (' + cz(cena) + ' Kč)';
      v('rok').textContent = 'Za rok ' + kc(hUspora * sazba * 12) + ' a ' + cz(Math.round(hUspora * 12)) + ' h';
      var pD = k.querySelector('[data-pruh="dnes"]'), pP = k.querySelector('[data-pruh="pak"]');
      if (pD) pD.style.width = '100%';
      if (pP) pP.style.width = (hDnes > 0 ? Math.max(4, hPak / hDnes * 100) : 0).toFixed(1) + '%';
    };
    Object.keys(vstupy).forEach(function (n) { vstupy[n].addEventListener('input', spocti); });
    tarify.forEach(function (t) {
      t.addEventListener('click', function () {
        tarif = t;
        tarify.forEach(function (x) { var on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        spocti();
      });
    });
    spocti();
  });

})();
