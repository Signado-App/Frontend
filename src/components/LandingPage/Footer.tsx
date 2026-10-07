"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <Image
                src="/assets/brand/signado-full-black.svg"
                alt="Signado"
                width={120}
                height={34}
                style={{ height: 34, width: "auto" }}
              />
            </Link>
            <p>
              Podklady od klientů jedním odkazem. Kontrola po položkách, automatické připomínky
              a&nbsp;vaše značka. Pro české firmy.
            </p>
            <div className="footer__social">
              <a
                href="https://linkedin.com/company/signado"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://x.com/signado_cz"
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Produkt</div>
            <a href="/jak-to-funguje.html">Jak to funguje</a>
            <a href="/produkt/etapy-zadosti.html">Etapy žádosti</a>
            <a href="/produkt/sprava-klientu.html">Kontrola a připomínky</a>
            <a href="/produkt/klientsky-portal.html">Klientský portál</a>
            <a href="/produkt/elektronicky-podpis.html">Schválení a podpis</a>
            <a href="/bezpecnost.html">Bezpečnost a data</a>
            <a href="/cenik.html">Ceník</a>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Řešení</div>
            <a href="/reseni/ucetni.html">Účetní a daňové kanceláře</a>
            <a href="/reseni/zakazkova-vyroba.html">Zakázková výroba a montáž</a>
            <a href="/reseni/pravnici.html">Advokátní kanceláře</a>
            <a href="/reseni/hr-a-nabor.html">HR a nábor</a>
            <a href="/reseni/stavebnictvi.html">Stavební firmy</a>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Proč Signado</div>
            <a href="/srovnani.html">Signado, nebo e-mail?</a>
            <a href="/caste-otazky.html">Časté otázky</a>
            <a href="/z/ukazka">Očima klienta</a>
            <a href="/o-nas.html">O nás</a>
            <a href="/blog/">Blog</a>
            <a href="/kontakt.html">Kontakt</a>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Právní</div>
            <a href="/podminky-pouziti.html">Podmínky použití</a>
            <a href="/ochrana-osobnich-udaju.html">Ochrana osobních údajů</a>
            <a href="/ochrana-osobnich-udaju.html#cookies">Cookies</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Signado. Provozováno v Česku 🇨🇿</span>
          <span className="spacer"></span>
          <a href="mailto:ahoj@signado.cz">ahoj@signado.cz</a>
        </div>
      </div>
    </footer>
  );
};
