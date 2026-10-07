"use client";

import React, { useState, useRef } from "react";

interface FaqItemData {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const FAQ_COL_1: FaqItemData[] = [
  {
    id: 1,
    question: "Musí si klient zakládat účet?",
    answer: (
      <p>
        Ne. Klient dostane odkaz e-mailem, otevře ho v&nbsp;telefonu nebo v&nbsp;počítači
        a&nbsp;vyplňuje. U&nbsp;položek najde vaše vysvětlení, proč je chcete, a&nbsp;když něčemu
        nerozumí, zeptá se přímo u&nbsp;nich. Rozepsané se mu průběžně ukládá, takže může přestat
        a&nbsp;vrátit se později.
      </p>
    ),
  },
  {
    id: 2,
    question: "Opravdu přestanu podklady shánět?",
    answer: (
      <p>
        Připomínky chodí podle plánu a&nbsp;každá vyjmenuje jen to, co ještě chybí. Klient vidí, co
        mu zbývá, a&nbsp;u&nbsp;vrácené položky najde důvod. Kdy zvednout telefon, rozhodujete vy.
      </p>
    ),
  },
  {
    id: 3,
    question: "Nebudou připomínky klienty otravovat?",
    answer: (
      <p>
        Plán připomínek vyberete při odeslání a&nbsp;každá připomínka obsahuje jen to, co ještě
        chybí. U&nbsp;konkrétní žádosti připomínky vypnete, přidáte vlastní, nebo je všechny
        pozastavíte, třeba když jste se s&nbsp;klientem domluvili po telefonu.
      </p>
    ),
  },
  {
    id: 4,
    question: "Stačí nám e-mail nebo formulář. Proč něco dalšího?",
    answer: (
      <p>
        Formulář je jedno odeslání. Žádost v&nbsp;Signadu běží dál: klient ji doplňuje, vy položky
        přijímáte nebo vracíte, připomínky chodí samy a&nbsp;další etapu otevřete, až budete chtít.
        Když od klienta potřebujete jednu přílohu jednou za čas, e-mail opravdu stačí.
      </p>
    ),
  },
];

const FAQ_COL_2: FaqItemData[] = [
  {
    id: 5,
    question: "Musíme kvůli tomu opustit systém, ve kterém pracujeme?",
    answer: (
      <p>
        Ne. Signado stojí před ním: sebere od klienta podklady, vy je zkontrolujete, stáhnete
        a&nbsp;pracujete s&nbsp;nimi dál tam, kde jste zvyklí. Kdyby vám přidalo víc přepisování,
        než ušetří, řekneme to při prvním hovoru.
      </p>
    ),
  },
  {
    id: 6,
    question: "Je bezpečné posílat přes Signado citlivé údaje?",
    answer: (
      <p>
        Odkaz je jedinečný a&nbsp;vede jen do jedné žádosti. Data ukládáme na serverech v&nbsp;EU
        a&nbsp;šifrujeme je při přenosu (TLS) i&nbsp;na serverech (
        <span style={{ whiteSpace: "nowrap" }}>AES-256</span>). Citlivé položky, třeba rodné číslo,
        se ve firmě zobrazí, až o&nbsp;ně někdo výslovně požádá. Podklady si kdykoli stáhnete
        a&nbsp;po skončení smlouvy máte 30&nbsp;dní na export, pak data smažeme. Víc na stránce{" "}
        <a href="/bezpecnost.html">Bezpečnost a&nbsp;data</a>.
      </p>
    ),
  },
  {
    id: 7,
    question: "Kolik to stojí a&nbsp;jak rychle začneme?",
    answer: (
      <p>
        Začít můžete zdarma, bez platební karty. Placené tarify začínají na 490&nbsp;Kč měsíčně bez
        DPH a&nbsp;bez ročního závazku. Platíte za svůj tým, ne za klienty. S&nbsp;hotovou šablonou
        pošlete první žádost hned: vyberete ji, doplníte e-mail klienta a&nbsp;odešlete.
        Podrobnosti jsou v&nbsp;<a href="/cenik.html">ceníku</a>.
      </p>
    ),
  },
];

const FaqItem: React.FC<{ item: FaqItemData }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq__item ${isOpen ? "is-open" : ""}`}>
      <button className="faq__q" aria-expanded={isOpen} onClick={toggle}>
        {item.question}
      </button>
      <div
        ref={contentRef}
        className="faq__a"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 300}px` : undefined,
        }}
      >
        {item.answer}
      </div>
    </div>
  );
};

export const Faq: React.FC = () => {
  return (
    <section className="section faq-sekce section--gray" id="otazky">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Otázky</span>
          <h2>Na co se ptáte nejčastěji</h2>
          <p className="section__lead">
            Nenašli jste odpověď? <a href="mailto:ahoj@signado.cz">Napište nám</a>, odpovídáme česky
            a&nbsp;obvykle do druhého pracovního dne.
          </p>
        </div>
        <div className="faq faq--karty faq--dva">
          <div className="faq__sloupec">
            {FAQ_COL_1.map(item => (
              <FaqItem key={item.id} item={item} />
            ))}
          </div>
          <div className="faq__sloupec">
            {FAQ_COL_2.map(item => (
              <FaqItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

