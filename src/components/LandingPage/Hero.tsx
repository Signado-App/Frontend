"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export const Hero: React.FC = () => {
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawn(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero hero--v2">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__copy">
            <span className="hero__eyebrow">
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
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Podklady od klientů pro české firmy
            </span>

            <h1 className="hero__title">
              Než začnete pracovat,
              <br />
              <span className={`hero__uline ${isDrawn ? "is-drawn" : ""}`}>
                mějte všechno.
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength="1" d="M3 14 C 60 6, 110 6, 150 11 S 245 16, 297 8" />
                </svg>
              </span>
            </h1>

            <p className="hero__lead">
              Pošlete klientovi jeden odkaz na všechno, co od něj potřebujete: údaje, doklady,
              odsouhlasení i&nbsp;podpis. Vyplní to bez účtu z&nbsp;telefonu a&nbsp;vy každou položku
              přijmete, nebo vrátíte s&nbsp;důvodem.
            </p>

            <ul className="hp-checks hp-checks--hero">
              <li>Připomínky jen na to, co chybí</li>
              <li>Vrátíte jen položku, která nesedí</li>
              <li>Další etapu, třeba smlouvu, otevřete, až budete mít podklady</li>
            </ul>

            <div className="hp-tlacitka">
              <div className="hero__cta-row">
                <Link
                  href="/auth/register"
                  className="btn btn--primary btn--lg"
                >
                  Vyzkoušet zdarma{" "}
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
                </Link>
                <a
                  href="/z/ukazka"
                  className="btn btn--secondary btn--lg"
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
              </div>
              <p className="hp-mikro">
                Bez platební karty. Vyzkoušejte zdarma nebo si projděte ukázkovou žádost.
              </p>
            </div>
          </div>

          <div className="hero__media">
            <figure
              className="hp-vizual"
              data-slot="v-hero-macbook"
              style={
                {
                  "--vw": 880,
                  "--vh": 640,
                  "--mw": 360,
                  "--mh": 460,
                } as React.CSSProperties
              }
            >
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet="/assets/vizualy/v-hero-macbook-m.webp?v=134"
                  width="360"
                  height="460"
                />
                <img
                  src="/assets/vizualy/v-hero-macbook.webp?v=134"
                  width={880}
                  height={640}
                  alt="Firma vrací položku s důvodem a klient ji vidí v telefonu"
                  loading="eager"
                  fetchPriority="high"
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
