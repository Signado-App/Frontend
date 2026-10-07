"use client";

import React from "react";

export const Problem: React.FC = () => {
  return (
    <section className="section" id="problem">
      <div className="container">
        <div className="hp-split hp-split--scena">
          <div className="hp-copy reveal reveal--l">
            <span className="eyebrow">Proč to dnes drhne</span>
            <h2>
              Shánět podklady by neměla být <span className="hp-hl">vaše práce</span>.
            </h2>
            <p>
              Abyste mohli začít, potřebujete od klienta pár věcí. Část přijde e-mailem, část přes
              WhatsApp. Jedna příloha je rozmazaná a&nbsp;na nejdůležitější otázku klient zapomněl
              odpovědět. Napíšete „jen se připomínám…“ a&nbsp;čekáte.
            </p>
            <p>
              Je pět odpoledne, na zakázce jste ještě nic neudělali a&nbsp;termín se posouvá.
            </p>
          </div>
          <div className="hp-split__img hp-rel reveal reveal--r">
            <div
              className="hp-scena hp-scena--pravo-dole hp-scena--teple"
              style={{ "--panel-h": "520px" } as React.CSSProperties}
            >
              <figure
                className="hp-vizual"
                data-slot="v-dnes"
                style={
                  {
                    "--vw": 640,
                    "--vh": 460,
                    "--mw": 360,
                    "--mh": 420,
                  } as React.CSSProperties
                }
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet="/assets/vizualy/v-dnes-m.webp?v=134"
                    width="360"
                    height="420"
                  />
                  <img
                    src="/assets/vizualy/v-dnes.webp?v=134"
                    width={640}
                    height={460}
                    alt="Podklady dnes: rozházené e-maily, přílohy a připomínání ve schránce"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

