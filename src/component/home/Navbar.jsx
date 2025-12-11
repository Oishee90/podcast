"use client";

import React from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import logoImage from "../../../public/Frame.webp";
import { PiWaveform } from "react-icons/pi";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-transparent robotos">
      <div className=" mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src={logoImage} alt="Logo" className="w-8 h-8" />
            <span className="text-white text-xl font-medium neutont">
              Podcast
            </span>
          </div>
        </Link>

        {/* Upload Button */}
        <Link href="/upload">
          <button className="neutont px-4 py-1.5 border border-[#76D8FF] rounded-md text-white text-base flex items-center gap-2 hover:bg-white/30 transition cursor-pointer">
            <PiWaveform size={24} />
            Upload
          </button>
        </Link>
      </div>
    </nav>
  );
}
