"use client";

import React from "react";

export const Security: React.FC = () => {
  return (
    <section className="section" id="bezpecnost">
      <div className="container">
        <div className="hp-sekce-head">
          <span className="eyebrow">Bezpečnost</span>
          <h2>Co děláme s&nbsp;daty vašich klientů</h2>
        </div>
        <div className="hp-karty hp-karty--4">
          <div className="hp-kar reveal">
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
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
              </svg>
            </span>
            <h3>Servery v&nbsp;EU a&nbsp;šifrování</h3>
            <p>
              Data ukládáme na serverech v&nbsp;Evropské unii a&nbsp;šifrujeme je při přenosu
              (TLS) i&nbsp;na serverech (<span style={{ whiteSpace: "nowrap" }}>AES-256</span>).
            </p>
          </div>

          <div className="hp-kar reveal reveal--d1">
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
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </span>
            <h3>Citlivé položky skryté</h3>
            <p>
              Rodné číslo nebo doklad se ve firmě zobrazí, až o&nbsp;ně někdo výslovně požádá.
              Každé zobrazení se zapíše.
            </p>
          </div>

          <div className="hp-kar reveal reveal--d2">
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
                <path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8" />
                <path d="M3 3v5h5M12 7v5l3 2" />
              </svg>
            </span>
            <h3>Historie u&nbsp;každé položky</h3>
            <p>
              U&nbsp;každé změny vidíte, kdy proběhla a&nbsp;jestli ji udělal klient, nebo vy.
            </p>
          </div>

          <div className="hp-kar reveal reveal--d1">
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
                <path d="M12 3v12M7 10l5 5 5-5" />
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </span>
            <h3>Export a&nbsp;doba uchování</h3>
            <p>
              Podklady si kdykoli stáhnete. Dobu uchování dokumentů si nastavíte sami. Po skončení
              smlouvy máte 30&nbsp;dní na export dat.
            </p>
          </div>
        </div>

        <div className="hp-bento-dalsi">
          <a className="link-arrow" href="/bezpecnost.html">
            Bezpečnost a&nbsp;data{" "}
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
    </section>
  );
};

