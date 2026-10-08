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
