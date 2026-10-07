"use client";

import React from "react";

export const FeaturesBento: React.FC = () => {
  return (
    <section className="section" id="funkce">
      <div className="container">
        <div className="hp-sekce-head">
          <span className="eyebrow">Co Signado pohlídá za vás</span>
          <h2>Vy rozhodujete. Hlídání nechte na Signadu.</h2>
        </div>
        <div className="hp-hlida">
          <article className="hp-hlida__hlavni reveal">
            <div className="hp-hlida__text">
              <span className="eyebrow">Připomínky</span>
              <h3>Připomínky jen na to, co chybí</h3>
              <p>
                Při odeslání vyberete plán připomínek. Klientovi chodí jeden souhrnný e-mail
                s&nbsp;tím, co ještě chybí. U&nbsp;žádosti připomínky vypnete, přidáte vlastní, nebo
                je všechny pozastavíte.
              </p>
              <a className="link-arrow" href="/produkt/sprava-klientu.html#pripominky">
                Jak fungují připomínky{" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
            <div className="hp-hlida__vizual">
              <figure
                className="hp-vizual"
                data-slot="v-pripominky"
                style={
                  {
                    "--vw": 760,
                    "--vh": 380,
                    "--mw": 360,
                    "--mh": 420,
                  } as React.CSSProperties
                }
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet="/assets/vizualy/v-pripominky-m.webp?v=134"
                    width="360"
                    height="420"
                  />
                  <img
                    src="/assets/vizualy/v-pripominky.webp?v=134"
                    width={760}
                    height={380}
                    alt="Plán automatických připomínek u žádosti a náhled e-mailu, který klientovi vyjmenuje, co ještě chybí"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </figure>
            </div>
          </article>

          <div className="hp-hlida__male">
            <a className="hp-hlida__karta reveal" href="/reseni/ucetni.html#hlida">
              <span
                className="hp-kar__ico"
                style={{ "--c": "#0B8A84" } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
              </span>
              <h3>Lhůty v&nbsp;jednom kalendáři</h3>
              <p>Termíny žádostí, plánované připomínky a&nbsp;lhůty smluv, barevně podle druhu.</p>
              <span className="link-arrow">
                Kalendář lhůt{" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>

            <a className="hp-hlida__karta reveal" href="/produkt/elektronicky-podpis.html">
              <span
                className="hp-kar__ico"
                style={{ "--c": "#A86B12" } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 012 2v4h5a2 2 0 012 2.3l-1.2 7A2 2 0 0116.8 20H7" />
                </svg>
              </span>
              <h3>Schválení konkrétní verze</h3>
              <p>Klient odsouhlasí verzi, kterou vidí, nebo napíše, co změnit.</p>
              <span className="link-arrow">
                Schválení a&nbsp;podpis{" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>

            <a className="hp-hlida__karta reveal" href="/jak-to-funguje.html">
              <span
                className="hp-kar__ico"
                style={{ "--c": "#5B54E0" } as React.CSSProperties}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
                </svg>
              </span>
              <h3>Vidíte, na koho se čeká</h3>
              <p>Co čeká na kontrolu, co na klienta a&nbsp;co je po termínu.</p>
              <span className="link-arrow">
                Jak žádost probíhá{" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>

            <a className="hp-hlida__karta reveal" href="/produkt/klientsky-portal.html">
              <span
                className="hp-kar__ico"
                style={{ "--c": "#475467" } as React.CSSProperties}
              >
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
              </span>
              <h3>Klient vidí vaši značku</h3>
              <p>Od tarifu Business vaše logo a&nbsp;barva na všem, co klient otevře.</p>
              <span className="link-arrow">
                Klientský portál{" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

