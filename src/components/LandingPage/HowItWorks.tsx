"use client";

import React from "react";

export const HowItWorks: React.FC = () => {

  return (
    <section className="section" id="jak-to-funguje">
      <div className="container">
        <div className="hp-kapitola">
          <div className="hp-kapitola__head reveal">
            <div>
              <span className="eyebrow">Jak to funguje</span>
              <h2>Od žádosti k&nbsp;hotovým podkladům ve čtyřech krocích</h2>
            </div>
            <div className="hp-kapitola__lead">
              <p>Vy vidíte, co čeká na vás. Klient vidí jen to, co má dodat.</p>
              <a
                className="link-arrow"
                href="/z/ukazka"
              >
                Projít žádost očima klienta{" "}
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

          <div className="hp-kapitola__body">
            <div
              className="hp-scena hp-scena--stred hp-scena--siroka"
              style={{ "--panel-h": "480px" } as React.CSSProperties}
            >
              <figure
                className="hp-vizual hp-vizual--siroky"
                data-slot="v-tok-home"
                style={
                  {
                    "--vw": 1300,
                    "--vh": 420,
                    "--mw": 360,
                    "--mh": 760,
                  } as React.CSSProperties
                }
              >
                <picture>
                  <source
                    media="(max-width: 1199px)"
                    srcSet="/assets/vizualy/v-tok-home-m.webp?v=134"
                    width="360"
                    height="760"
                  />
                  <img
                    src="/assets/vizualy/v-tok-home.webp?v=134"
                    width={1300}
                    height={420}
                    alt="Čtyři kroky žádosti: odeslání odkazu, vyplnění klientem, kontrola po položkách a otevření další etapy e-mailem"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </figure>
            </div>

            <ol
              className="hp-kroky"
              style={{ "--sloupce": 4 } as React.CSSProperties}
            >
              <li className="reveal">
                <span className="hp-kroky__n">
                  01<span className="hp-kdo hp-kdo--vy">Vy</span>
                </span>
                <h3>Vyberete šablonu a&nbsp;pošlete odkaz</h3>
                <p>
                  Hotovou pro váš obor, nebo vlastní. Doplníte, co u&nbsp;tohoto klienta potřebujete
                  navíc, a&nbsp;klient dostane e-mail s&nbsp;jedním odkazem.
                </p>
              </li>
              <li className="reveal reveal--d1">
                <span className="hp-kroky__n">
                  02<span className="hp-kdo hp-kdo--klient">Klient</span>
                </span>
                <h3>Klient vyplní, co umí</h3>
                <p>
                  Bez účtu a&nbsp;hesla, z&nbsp;telefonu i&nbsp;z&nbsp;počítače. Vidí, kolik mu
                  zbývá, a&nbsp;u&nbsp;položek najde vaše vysvětlení, proč je chcete. Když něčemu
                  nerozumí, zeptá se přímo u&nbsp;položky.
                </p>
              </li>
              <li className="reveal reveal--d2">
                <span className="hp-kroky__n">
                  03<span className="hp-kdo hp-kdo--vy">Vy</span>
                </span>
                <h3>Vy kontrolujete po položkách</h3>
                <p>
                  Co sedí, přijmete. Co ne, vrátíte s&nbsp;jednou větou, třeba „chybí strana 2“.
                  Klient opravuje jen tu jednu položku, zbytek jde dál.
                </p>
              </li>
              <li className="reveal">
                <span className="hp-kroky__n">
                  04<span className="hp-kdo hp-kdo--vy">Vy</span>
                </span>
                <h3>Máte všechno a&nbsp;jdete pracovat</h3>
                <p>
                  Hotovo je, až přijmete všechny povinné položky. Podklady si stáhnete najednou. Další
                  etapu, třeba smlouvu, klientovi otevřete e-mailem, až budete chtít.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

