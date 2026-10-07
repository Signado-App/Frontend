"use client";

import React, { useEffect } from "react";
import "./page.scss";
import { Navigation } from "@/components/LandingPage/Navigation";
import { Hero } from "@/components/LandingPage/Hero";
import { HowItWorks } from "@/components/LandingPage/HowItWorks";
import { Industries } from "@/components/LandingPage/Industries";
import { Problem } from "@/components/LandingPage/Problem";
import { Comparison } from "@/components/LandingPage/Comparison";
import { FeaturesBento } from "@/components/LandingPage/FeaturesBento";
import { ClientPerspective } from "@/components/LandingPage/ClientPerspective";
import { Security } from "@/components/LandingPage/Security";
import { Faq } from "@/components/LandingPage/Faq";
import { FinalCta } from "@/components/LandingPage/FinalCta";
import { Footer } from "@/components/LandingPage/Footer";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("hp");

    // Scroll reveal observer
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      const io = new IntersectionObserver(
        entries => {
          entries.forEach(en => {
            if (en.isIntersecting) {
              en.target.classList.add("is-visible");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach(el => io.observe(el));
      return () => io.disconnect();
    } else {
      revealEls.forEach(el => el.classList.add("is-visible"));
    }
  }, []);

  return (
    <div className="hp" data-cta="zkusit">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Industries />
      <Problem />
      <Comparison />
      <FeaturesBento />
      <ClientPerspective />
      <Security />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
