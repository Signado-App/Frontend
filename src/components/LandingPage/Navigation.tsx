"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export const Navigation: React.FC<NavigationProps> = () => {
  const [isStuck, setIsStuck] = useState(false);
  const [activeMega, setActiveMega] = useState<"produkt" | "reseni" | "proc" | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"cs" | "en">("cs");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDrawerGroups, setOpenDrawerGroups] = useState<{ [key: string]: boolean }>({
    produkt: false,
    reseni: false,
    proc: false,
  });

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll handler for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 4);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        setIsSearching(false);
        setIsLangOpen(false);
      }
      if (e.key === "/" && document.activeElement === document.body) {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => searchInputRef.current?.focus(), 60);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isDrawerOpen]);

  // Handle mega open / close timers
  const openMega = (name: "produkt" | "reseni" | "proc") => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMega(name);
  };

  const scheduleCloseMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 140);
  };

  const toggleMega = (name: "produkt" | "reseni" | "proc") => {
    setActiveMega(prev => (prev === name ? null : name));
  };

  const closeAll = () => {
    setActiveMega(null);
    setIsSearching(false);
    setIsLangOpen(false);
    setIsDrawerOpen(false);
  };

  const toggleDrawerGroup = (name: string) => {
    setOpenDrawerGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <nav
        className={`nav ${isStuck ? "is-stuck" : ""} ${isSearching ? "is-searching" : ""}`}
        id="nav"
      >
        <div className="container nav__inner">
          <Link href="/" className="nav__brand" onClick={closeAll}>
            <Image
              src="/assets/brand/signado-full-black.svg"
              alt="Signado"
              className="nav__logo"
              width={120}
              height={32}
              priority
            />
          </Link>

          <ul className="nav__list">
            {/* Mega: Produkt */}
            <li
              className={`nav__item ${activeMega === "produkt" ? "is-open" : ""}`}
              data-mega
              onMouseEnter={() => openMega("produkt")}
              onMouseLeave={scheduleCloseMega}
            >
              <button
                className="nav__trigger"
                aria-expanded={activeMega === "produkt"}
                aria-haspopup="true"
                onClick={e => {
                  e.preventDefault();
                  toggleMega("produkt");
                }}
              >
                Produkt
                <svg
                  className="chev"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className="mega mega--produkt"
                onMouseEnter={() => {
                  if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                }}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="mega__inner">
                  <div className="mega__col">
                    <p className="mega__col-title">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 4h6l1 2h3v14H5V6h3z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                      Žádost
                    </p>
                    <a className="mega__link mega__link--sub" href="/produkt/etapy-zadosti.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Etapy žádosti</b>
                        <small>Další etapa až po kontrole</small>
                      </span>
                    </a>
                    <a className="mega__link mega__link--sub" href="/produkt/sprava-klientu.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Kontrola a připomínky</b>
                        <small>Přijmete, vrátíte s důvodem, připomenete</small>
                      </span>
                    </a>
                    <a className="mega__link mega__link--sub" href="/produkt/elektronicky-podpis.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Schválení a podpis</b>
                        <small>Konkrétní verze a prostý elektronický podpis</small>
                      </span>
                    </a>
                  </div>

                  <div className="mega__col">
                    <p className="mega__col-title">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                      </svg>
                      Klient a data
                    </p>
                    <a className="mega__link mega__link--sub" href="/produkt/klientsky-portal.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Klientský portál</b>
                        <small>Bez účtu, z telefonu, s vaší značkou</small>
                      </span>
                    </a>
                    <a className="mega__link mega__link--sub" href="/bezpecnost.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Bezpečnost a data</b>
                        <small>Servery v EU, šifrování a export</small>
                      </span>
                    </a>
                  </div>

                  <a className="mega__hlavni" href="/jak-to-funguje.html" onClick={closeAll}>
                    <span className="mega__hlavni-scena" aria-hidden="true">
                      <span className="mk">
                        <i style={{ "--c": "#5B54E0" } as React.CSSProperties}>1</i>Odkaz
                      </span>
                      <span className="mk">
                        <i style={{ "--c": "#1F6FD1" } as React.CSSProperties}>2</i>Klient vyplní
                      </span>
                      <span className="mk">
                        <i style={{ "--c": "#0B8A84" } as React.CSSProperties}>3</i>Kontrola
                      </span>
                      <span className="mk">
                        <i style={{ "--c": "#017737" } as React.CSSProperties}>✓</i>Hotovo
                      </span>
                    </span>
                    <small className="mega__hlavni-k">Začněte tady</small>
                    <b>Jak to funguje →</b>
                    <span>Od odkazu po kompletní podklady ve čtyřech krocích.</span>
                  </a>
                </div>
              </div>
            </li>

            {/* Mega: Řešení */}
            <li
              className={`nav__item ${activeMega === "reseni" ? "is-open" : ""}`}
              data-mega
              onMouseEnter={() => openMega("reseni")}
              onMouseLeave={scheduleCloseMega}
            >
              <button
                className="nav__trigger"
                aria-expanded={activeMega === "reseni"}
                aria-haspopup="true"
                onClick={e => {
                  e.preventDefault();
                  toggleMega("reseni");
                }}
              >
                Řešení
                <svg
                  className="chev"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className="mega mega--reseni"
                onMouseEnter={() => {
                  if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                }}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="mega__inner">
                  <a
                    className="mega__obor mega__obor--doc"
                    href="/reseni/ucetni.html"
                    style={{ "--c": "#0B8A84" } as React.CSSProperties}
                    onClick={closeAll}
                  >
                    <span className="mega__obor-scena" aria-hidden="true"></span>
                    <b>Účetní a daňové kanceláře</b>
                    <small>Převzetí nové firmy a měsíční doklady bez shánění.</small>
                  </a>
                  <a
                    className="mega__obor mega__obor--check"
                    href="/reseni/zakazkova-vyroba.html"
                    style={{ "--c": "#5B54E0" } as React.CSSProperties}
                    onClick={closeAll}
                  >
                    <span className="mega__obor-scena" aria-hidden="true"></span>
                    <b>Zakázková výroba a montáž</b>
                    <small>Objednáte, až zákazník schválí přesnou verzi.</small>
                  </a>
                  <a
                    className="mega__obor mega__obor--pen"
                    href="/reseni/pravnici.html"
                    style={{ "--c": "#C2366B" } as React.CSSProperties}
                    onClick={closeAll}
                  >
                    <span className="mega__obor-scena" aria-hidden="true"></span>
                    <b>Advokátní kanceláře</b>
                    <small>Spis otevřete, až máte doklady a podepsanou smlouvu.</small>
                  </a>
                  <a
                    className="mega__obor mega__obor--user"
                    href="/reseni/hr-a-nabor.html"
                    style={{ "--c": "#1F6FD1" } as React.CSSProperties}
                    onClick={closeAll}
                  >
                    <span className="mega__obor-scena" aria-hidden="true"></span>
                    <b>HR a nábor</b>
                    <small>Životopis, certifikáty a souhlas kandidáta jedním odkazem.</small>
                  </a>
                  <a
                    className="mega__obor mega__obor--box"
                    href="/reseni/stavebnictvi.html"
                    style={{ "--c": "#A86B12" } as React.CSSProperties}
                    onClick={closeAll}
                  >
                    <span className="mega__obor-scena" aria-hidden="true"></span>
                    <b>Stavební firmy</b>
                    <small>Doklady subdodavatelů a zadání stavebníka na jednom místě.</small>
                  </a>
                  <a className="mega__obor mega__obor--kontakt" href="/reseni/dalsi-obory.html" onClick={closeAll}>
                    <span className="mega__obor-scena" aria-hidden="true">
                      <span className="mega__obor-otaznik">?</span>
                    </span>
                    <b>Nevidíte svůj obor?</b>
                    <small>Najdeme řešení spolu, nebo postup nastavíme na míru.</small>
                  </a>
                </div>
              </div>
            </li>

            {/* Mega: Proč Signado */}
            <li
              className={`nav__item ${activeMega === "proc" ? "is-open" : ""}`}
              data-mega
              onMouseEnter={() => openMega("proc")}
              onMouseLeave={scheduleCloseMega}
            >
              <button
                className="nav__trigger"
                aria-expanded={activeMega === "proc"}
                aria-haspopup="true"
                onClick={e => {
                  e.preventDefault();
                  toggleMega("proc");
                }}
              >
                Proč Signado
                <svg
                  className="chev"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                className="mega mega--proc"
                onMouseEnter={() => {
                  if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                }}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="mega__inner">
                  <div className="mega__col">
                    <p className="mega__col-title">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
                      </svg>
                      Proč Signado
                    </p>
                    <a className="mega__link mega__link--sub" href="/srovnani.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Signado, nebo e-mail?</b>
                        <small>Kdy e-mail stačí a kdy už ne</small>
                      </span>
                    </a>
                    <a className="mega__link mega__link--sub" href="/caste-otazky.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Časté otázky</b>
                        <small>Účet klienta, připomínky, data, cena</small>
                      </span>
                    </a>
                  </div>

                  <div className="mega__col">
                    <p className="mega__col-title">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 21V8l8-5 8 5v13" />
                        <path d="M9 21v-6h6v6" />
                      </svg>
                      Společnost
                    </p>
                    <a className="mega__link mega__link--sub" href="/o-nas.html" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>O nás</b>
                        <small>Kdo za Signadem stojí</small>
                      </span>
                    </a>
                    <a className="mega__link mega__link--sub" href="/blog/" onClick={closeAll}>
                      <span className="arr">→</span>
                      <span>
                        <b>Blog</b>
                        <small>Články o podkladech a podpisu</small>
                      </span>
                    </a>
                    <a
                      className="mega__link mega__link--sub"
                      href="/kontakt.html"
                      onClick={closeAll}
                    >
                      <span className="arr">→</span>
                      <span>
                        <b>Kontakt</b>
                        <small>Odpovídáme česky</small>
                      </span>
                    </a>
                  </div>

                  <a
                    className="mega__hlavni"
                    href="/z/ukazka"
                    onClick={closeAll}
                  >
                    <span className="mega__hlavni-scena" aria-hidden="true">
                      <span className="mt">
                        <span className="mt__l">Účetní kancelář Mochnová</span>
                        <span className="mt__p">
                          <i></i>
                        </span>
                        <span className="mt__r">
                          Výpis z účtu<em>Hotovo</em>
                        </span>
                        <span className="mt__r">
                          Faktury za září<em className="v">Vráceno</em>
                        </span>
                      </span>
                    </span>
                    <small className="mega__hlavni-k">Vyzkoušejte</small>
                    <b>Očima klienta →</b>
                    <span>Projděte si ukázkovou žádost jako váš klient. Na konci objednáte demo.</span>
                  </a>
                </div>
              </div>
            </li>

            {/* Link: Ceník */}
            <li className="nav__item">
              <a className="nav__plain" href="/cenik.html" onClick={closeAll}>
                Ceník
              </a>
            </li>
          </ul>

          <span className="nav__spacer"></span>

          <div className="nav__actions">
            {/* Search */}
            <form
              className={`nav__search ${isSearching ? "is-searching" : ""}`}
              id="nav-search"
              role="search"
              onSubmit={e => {
                e.preventDefault();
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className="nav__icon-btn nav__search-toggle"
                id="nav-search-btn"
                aria-label="Hledat na webu"
                aria-expanded={isSearching}
                onClick={e => {
                  e.stopPropagation();
                  setIsSearching(!isSearching);
                  if (!isSearching) {
                    setTimeout(() => searchInputRef.current?.focus(), 60);
                  }
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
              <input
                ref={searchInputRef}
                className="nav__search-input"
                id="nav-search-input"
                type="search"
                placeholder="Hledat"
                autoComplete="off"
                tabIndex={isSearching ? 0 : -1}
              />
              <button
                type="button"
                className="nav__search-close"
                id="nav-search-close"
                aria-label="Zavřít hledání"
                onClick={() => setIsSearching(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </form>

            {/* Language */}
            <div className={`nav__lang ${isLangOpen ? "is-open" : ""}`} id="nav-lang">
              <button
                className="nav__icon-btn nav__lang-btn"
                id="nav-lang-btn"
                aria-label="Změnit jazyk"
                aria-expanded={isLangOpen}
                onClick={e => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
                </svg>
                <svg
                  className="nav__lang-caret"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="nav__lang-menu" id="nav-lang-menu" role="menu">
                <button
                  className={`nav__lang-opt ${currentLang === "cs" ? "is-active" : ""}`}
                  role="menuitem"
                  onClick={() => {
                    setCurrentLang("cs");
                    setIsLangOpen(false);
                  }}
                >
                  Čeština
                </button>
                <button
                  className={`nav__lang-opt ${currentLang === "en" ? "is-active" : ""}`}
                  role="menuitem"
                  onClick={() => {
                    setCurrentLang("en");
                    setIsLangOpen(false);
                  }}
                >
                  English
                </button>
              </div>
            </div>

            <Link href="/auth/login" className="btn btn--ghost nav__login">
              Přihlásit se
            </Link>
            <Link href="/auth/login" className="btn btn--primary nav__cta-desktop">
              Vyzkoušet zdarma
            </Link>

            <button
              className="nav__burger"
              id="nav-burger"
              aria-label="Otevřít menu"
              aria-expanded={isDrawerOpen}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`drawer ${isDrawerOpen ? "is-open" : ""}`} id="drawer">
        <div className={`drawer__group ${openDrawerGroups.produkt ? "is-open" : ""}`}>
          <button className="drawer__gtoggle" onClick={() => toggleDrawerGroup("produkt")}>
            Produkt
            <svg
              className="chev"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="drawer__links">
            <a href="/jak-to-funguje.html" onClick={closeAll}>
              Jak to funguje
            </a>
            <a href="/produkt/etapy-zadosti.html" onClick={closeAll}>
              Etapy žádosti
            </a>
            <a href="/produkt/sprava-klientu.html" onClick={closeAll}>
              Kontrola a připomínky
            </a>
            <a href="/produkt/klientsky-portal.html" onClick={closeAll}>
              Klientský portál
            </a>
            <a href="/produkt/elektronicky-podpis.html" onClick={closeAll}>
              Schválení a podpis
            </a>
            <a href="/bezpecnost.html" onClick={closeAll}>
              Bezpečnost a data
            </a>
          </div>
        </div>

        <div className={`drawer__group ${openDrawerGroups.reseni ? "is-open" : ""}`}>
          <button className="drawer__gtoggle" onClick={() => toggleDrawerGroup("reseni")}>
            Řešení
            <svg
              className="chev"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="drawer__links">
            <a href="/reseni/ucetni.html" onClick={closeAll}>
              Účetní a daňové kanceláře
            </a>
            <a href="/reseni/zakazkova-vyroba.html" onClick={closeAll}>
              Zakázková výroba a montáž
            </a>
            <a href="/reseni/pravnici.html" onClick={closeAll}>
              Advokátní kanceláře
            </a>
            <a href="/reseni/hr-a-nabor.html" onClick={closeAll}>
              HR a nábor
            </a>
            <a href="/reseni/stavebnictvi.html" onClick={closeAll}>
              Stavební firmy
            </a>
          </div>
        </div>

        <div className={`drawer__group ${openDrawerGroups.proc ? "is-open" : ""}`}>
          <button className="drawer__gtoggle" onClick={() => toggleDrawerGroup("proc")}>
            Proč Signado
            <svg
              className="chev"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="drawer__links">
            <a href="/srovnani.html" onClick={closeAll}>
              Signado, nebo e-mail?
            </a>
            <a href="/caste-otazky.html" onClick={closeAll}>
              Časté otázky
            </a>
            <a href="/z/ukazka" onClick={closeAll}>
              Očima klienta
            </a>
            <a href="/o-nas.html" onClick={closeAll}>
              O nás
            </a>
            <a href="/blog/" onClick={closeAll}>
              Blog
            </a>
            <a href="/kontakt.html" onClick={closeAll}>
              Kontakt
            </a>
          </div>
        </div>

        <div className="drawer__group">
          <button
            className="drawer__gtoggle"
            onClick={() => {
              closeAll();
              window.location.href = "/cenik.html";
            }}
          >
            Ceník
          </button>
        </div>

        <div className="drawer__cta">
          <Link href="/auth/login" className="btn btn--outline" onClick={closeAll}>
            Přihlásit se
          </Link>
          <Link
            href="/auth/login"
            className="btn btn--primary"
            style={{ marginTop: 12 }}
            onClick={closeAll}
          >
            Vyzkoušet zdarma
          </Link>
          <a
            href="/z/ukazka"
            className="btn btn--secondary"
            style={{ marginTop: 12 }}
            onClick={closeAll}
          >
            Rezervovat demo
          </a>
        </div>
      </div>
    </>
  );
};

