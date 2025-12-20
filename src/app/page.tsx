"use client";
import Image from "next/image";
import "./page.scss";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/LandingPage/NavigationBar";
import { Footer } from "@/components/LandingPage/Footer";
import { Hero } from "@/components/LandingPage/Hero";
import { Features } from "@/components/LandingPage/Features";
import { HeaderWithActions } from "@/components/LandingPage/HeaderWithActions";
import { FeatureBigLeft } from "@/components/LandingPage/FeatureBigLeft";
import { FeatureBigRight } from "@/components/LandingPage/FeatureBigRight";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureBigLeft />
      <FeatureBigRight />
      <HeaderWithActions />
      <Features />
      <Footer />
    </>
  )
}
