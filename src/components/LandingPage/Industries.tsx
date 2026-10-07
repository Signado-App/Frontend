"use client";

import React from "react";

export const Industries: React.FC = () => {
  return (
    <section className="section section--gray" id="obory">
      <div className="container">
        <div className="hp-head">
          <svg className="hp-arrow" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M44 6 C 18 8, 6 26, 14 46 M8 38 l6 9 9-5" />
          </svg>
          <div>
            <span className="hp-head__kicker">Vyberte svůj obor</span>
            <h2>Čím se zabýváte?</h2>
          </div>
        </div>

        <div className="hp-obory">
          <a className="hp-obor hp-obor--v2 hp-obor--foto reveal" href="/reseni/ucetni.html">
            <span className="hp-obor__pole hp-obor__pole--foto" aria-hidden="true">
              <img
                className="hp-obor__obr"
                src="/assets/obory/obor-ucetni.webp?v=1"
                alt=""
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </span>
            <h3 className="hp-obor__name">
              Účetní a <b>daňové kanceláře</b>
            </h3>
            <p>
              Převzetí nové firmy po etapách a&nbsp;každý měsíc doklady za období, bez ručního
              připomínání.
            </p>
            <span className="hp-obor__foot">
              Nový klient i&nbsp;měsíční podklady{" "}
              <span className="hp-go">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          </a>

          <a className="hp-obor hp-obor--v2 hp-obor--foto reveal" href="/reseni/zakazkova-vyroba.html">
            <span className="hp-obor__pole hp-obor__pole--foto" aria-hidden="true">
              <img
                className="hp-obor__obr"
                src="/assets/obory/obor-vyroba.webp?v=1"
                alt=""
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </span>
            <h3 className="hp-obor__name">
              Zakázková <b>výroba a&nbsp;montáž</b>
            </h3>
            <p>
              Rozměry a&nbsp;schválená specifikace od zákazníka dřív, než cokoli objednáte
              u&nbsp;výrobce.
            </p>
            <span className="hp-obor__foot">
              Schválení před výrobou{" "}
              <span className="hp-go">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          </a>

          <a className="hp-obor hp-obor--v2 hp-obor--foto reveal" href="/reseni/pravnici.html">
            <span className="hp-obor__pole hp-obor__pole--foto" aria-hidden="true">
              <img
                className="hp-obor__obr"
                src="/assets/obory/obor-pravo.webp?v=1"
                alt=""
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
              />
            </span>
            <h3 className="hp-obor__name">
              Advokátní <b>kanceláře</b>
            </h3>
            <p>
              Údaje klienta, doklady a&nbsp;smlouva o&nbsp;poskytování právních služeb jedním
              odkazem. Spis založíte, až budete mít všechno.
            </p>
            <span className="hp-obor__foot">
              Přijetí nového klienta{" "}
              <span className="hp-go">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          </a>
        </div>

        <div className="hp-jiny reveal">
          <div>
            <strong>Není tu váš obor?</strong> Myslíte si, že bychom spolu našli řešení, nebo
            hledáte podobnou službu přímo na&nbsp;míru?{" "}
            <a href="/reseni/dalsi-obory.html">Domluvte si schůzku &rarr;</a>
          </div>
        </div>
      </div>
    </section>
  );
};

