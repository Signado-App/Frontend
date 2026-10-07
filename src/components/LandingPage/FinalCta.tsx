"use client";

import React from "react";
import Link from "next/link";

export const FinalCta: React.FC = () => {
  return (
    <section className="section final">
      <div className="container final__inner hp-final hp-final--v2">
        <h2 className="final__title">Zkuste to na jednom klientovi.</h2>
        <p className="final__text">
          Nic nepřevádíte a&nbsp;nikoho neškolíte. Vyberte klienta, po kterém sháníte podklady
          nejčastěji, pošlete mu jeden odkaz a&nbsp;uvidíte, co od něj dorazí.
        </p>
        <div className="final__cta-row">
          <Link href="/auth/login" className="btn btn--primary btn--lg">
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
            className="btn btn--light btn--lg"
          >
            Rezervovat demo
          </a>
        </div>
        <p className="hp-mikro">Bez platební karty. Bez ročního závazku.</p>
      </div>
    </section>
  );
};

