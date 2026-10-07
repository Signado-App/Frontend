"use client";

import React from "react";

export const ClientPerspective: React.FC = () => {
  return (
    <section className="section section--lilac hp-presah" id="pro-klienta">
      <div className="container">
        <div className="hp-split hp-split--rev hp-split--scena">
          <div className="hp-copy reveal reveal--r">
            <span className="eyebrow">Pro klienta</span>
            <h2>
              Vyplní to z&nbsp;telefonu.
              <br /> <span className="hp-hl">Bez účtu, bez hesla.</span>
            </h2>
            <p>
              Klient nechce kvůli pár dokladům zakládat další účet. Proto po něm žádný nechceme.
              Otevře odkaz z&nbsp;e-mailu a&nbsp;rovnou vyplňuje.
            </p>
            <ul className="hp-checks">
              <li>Doklad vyfotí rovnou telefonem</li>
              <li>U&nbsp;položek najde vaše vysvětlení, proč je chcete</li>
              <li>Vidí, kolik mu zbývá a&nbsp;co jste mu vrátili</li>
              <li>Když něčemu nerozumí, zeptá se přímo u&nbsp;položky</li>
            </ul>
            <div className="hp-sub__cta">
              <a
                href="/z/ukazka"
                className="btn btn--light btn--lg"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: 8 }}
                  aria-hidden="true"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Očima klienta
              </a>
              <a className="link-arrow" href="/produkt/klientsky-portal.html">
                Co klient uvidí{" "}
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
          </div>
          <div className="hp-split__img hp-rel reveal reveal--l">
            <figure
              className="hp-vizual"
              data-slot="v-mobil-velky"
              style={
                {
                  "--vw": 600,
                  "--vh": 720,
                  "--mw": 360,
                  "--mh": 680,
                } as React.CSSProperties
              }
            >
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet="/assets/vizualy/v-mobil-velky-m.webp?v=134"
                  width="360"
                  height="680"
                />
                <img
                  src="/assets/vizualy/v-mobil-velky.webp?v=134"
                  width={600}
                  height={720}
                  alt="Klient v telefonu vidí, kolik mu zbývá, a vrácenou položku s důvodem"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

