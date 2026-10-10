"use client";

import React from "react";
import Link from "next/link";

export const Comparison: React.FC = () => {
  return (
    <section className="section section--gray" id="rozdil">
      <div className="container">
        <div className="hp-sekce-head hp-sekce-head--c reveal">
          <span className="eyebrow">Rozdíl</span>
          <h2>
            Dnes podklady sháníte vy.
            <br />
            Se Signadem chodí za vámi.
          </h2>
          <p>
            E-mail a&nbsp;WhatsApp zvládnou výjimku. Opakovanou žádost, kterou je potřeba
            kontrolovat, už ne.
          </p>
        </div>
        <div className="hp-srovnani reveal">
          <table>
            <thead>
              <tr>
                <th scope="col" className="hp-srovnani__co"></th>
                <th scope="col" className="hp-srovnani__dnes">
                  E-mail, WhatsApp a&nbsp;úschovna
                </th>
                <th scope="col" className="hp-srovnani__my">
                  Signado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Co klient dostane
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  Seznam v&nbsp;e-mailu, který zapadne pod další zprávy
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  Jeden odkaz se seznamem a&nbsp;vaším vysvětlením u&nbsp;každé položky
                </td>
              </tr>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Kde jsou podklady
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  V&nbsp;pěti vláknech, v&nbsp;telefonu kolegy a&nbsp;v&nbsp;odkazu, který mezitím
                  vypršel
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  Všechny u&nbsp;žádosti, každá položka s&nbsp;historií. Stáhnete je najednou
                </td>
              </tr>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Co ještě chybí
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  Skládáte dohromady sami
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  U&nbsp;každé žádosti vidíte, co chybí a&nbsp;na koho se čeká
                </td>
              </tr>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Připomínání
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  Píšete ručně, často i&nbsp;kvůli tomu, co už přišlo
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  Podle plánu, který vyberete při odeslání. Klient dostane jeden e-mail jen s&nbsp;tím,
                  co chybí
                </td>
              </tr>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Když něco nesedí
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  Vysvětlujete v&nbsp;e-mailu a&nbsp;klient pošle všechno znovu
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  Vrátíte jednu položku s&nbsp;důvodem a&nbsp;zbytek jde dál
                </td>
              </tr>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Která verze platí
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  „Volali jsme si a&nbsp;bylo to schválené.“
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  Klient schválí konkrétní verzi. Upravenou mu pošlete znovu
                </td>
              </tr>
              <tr>
                <th scope="row" className="hp-srovnani__co">
                  Další krok, třeba smlouva
                </th>
                <td className="hp-srovnani__dnes" data-label="E-mail, WhatsApp a úschovna">
                  Pošlete ji, až si vzpomenete
                </td>
                <td className="hp-srovnani__my" data-label="Signado">
                  Otevřete ji klientovi e-mailem, až budete chtít
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="hp-copy reveal" style={{ marginTop: 32 }}>
          <p>
            Když od klienta potřebujete jednu přílohu jednou za čas, e-mail stačí. Signado se
            vyplatí, když totéž chcete po mnoha klientech nebo opakovaně.
          </p>
        </div>
        <div className="hp-tlacitka">
          <div className="hp-sub__cta">
            <Link href="/auth/register" className="btn btn--primary btn--lg">
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
          </div>
          <p className="hp-mikro">Bez platební karty. Bez ročního závazku.</p>
        </div>
      </div>
    </section>
  );
};

