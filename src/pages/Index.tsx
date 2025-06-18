import * as React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Index() {
  return (
    <div className="bg-[#FFF9F5] min-h-[1080px] overflow-hidden">
      <Header />
      <Hero />
    </div>
  );
}
