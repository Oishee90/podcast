"use client";

import React from "react";
import LightRays from "@/components/LightRays";
import { Upload } from "lucide-react";
import Image from "next/image";
import bannerImage from "../../../public/MacBook Pro 14_ - 3.webp";
import Navbar from "../home/Navbar";
import { PiWaveform } from "react-icons/pi";
import Link from "next/link";
export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden min-h-screen ">
      <Image
        src={bannerImage}
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full"
      />
      <Navbar></Navbar>
      {/* LightRays Effect */}
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="right"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={1.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-4">
        <h1 className="text-white text-4xl md:text-6xl font-semibold neutont">
          Listen to the Highlights in a{" "}
          <span className="text-[#439CBF]">snap</span>
        </h1>

        <p className="text-gray-300 mt-4 max-w-xl">
          Quickly access the key takeaways from your favorite podcasts, skipping
          the unnecessary chatter and saving you time.
        </p>

        <Link href="/upload">
          {" "}
          <button className="mt-6 px-6 py-2 border border-[#76D8FF] rounded-lg text-white hover:bg-white/50 transition  flex items-center gap-2 cursor-pointer ease-in-out neutont text-xl">
            <PiWaveform size={24} /> Upload
          </button>
        </Link>
      </div>
    </div>
  );
}
