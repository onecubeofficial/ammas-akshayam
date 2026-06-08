"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { tamilNaduRegions } from "@/lib/data";

// Place 8 regions evenly around a circle
const RADIUS = 110; // px from centre
const CX = 160;     // viewBox centre x
const CY = 160;     // viewBox centre y

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function TamilNaduHeritage() {
  return (
    <section className="py-16 bg-gradient-to-br from-maroon-900 to-maroon-800 dark:from-gray-950 dark:to-gray-900 overflow-hidden relative">
      <div className="absolute inset-0 kolam-bg opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Tamil Nadu Heritage"
          titleTamil="தமிழ்நாடு பாரம்பரியம்"
          subtitle="Serving authentic flavors across the rich and diverse regions of Tamil Nadu"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Story ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-cream"
          >
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 rounded-full px-4 py-2 text-sm font-medium mb-5">
              🌿 Our Story
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Preserving the Authentic Flavors of Tamil Nadu
            </h3>
            <p className="text-cream/80 leading-relaxed mb-4">
              Tamil Nadu has a rich culinary heritage that dates back thousands
              of years. From the temple town of Madurai to the rice bowls of
              Thanjavur, every region carries unique recipes and food traditions.
            </p>
            <p className="text-cream/80 leading-relaxed mb-6">
              Amma&apos;s Akshayam was born from a simple desire — to preserve
              these authentic recipes and make them accessible to families
              everywhere. Each product is crafted with traditional methods,
              using locally sourced ingredients from Tamil Nadu&apos;s fertile
              lands.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { v: "38", l: "Districts" },
                { v: "200+", l: "Products" },
                { v: "6+", l: "Years" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="bg-white/10 rounded-xl p-4 text-center border border-white/10"
                >
                  <div className="text-2xl font-display font-bold text-gold-400">{v}</div>
                  <div className="text-xs text-cream/70 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Region Wheel ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            {/* Wheel */}
            <div className="relative w-full max-w-sm mx-auto select-none">
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full drop-shadow-2xl"
                aria-label="Regions we serve"
              >
                {/* Outer decorative ring */}
                <circle cx={CX} cy={CY} r={RADIUS + 16} fill="none" stroke="#D4A017" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 6" />

                {/* Spoke + node for each region */}
                {tamilNaduRegions.map((region, i) => {
                  const angle = (i / tamilNaduRegions.length) * 360;
                  const dot   = polarToCartesian(CX, CY, RADIUS, angle);
                  const label = polarToCartesian(CX, CY, RADIUS + 32, angle);

                  // Push label outward a bit on left side so it doesn't overlap centre
                  const isLeft = dot.x < CX;
                  const anchor = isLeft ? "end" : "start";
                  const labelX = label.x + (isLeft ? -4 : 4);

                  return (
                    <motion.g
                      key={region.name}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      {/* Spoke */}
                      <line
                        x1={CX} y1={CY}
                        x2={dot.x} y2={dot.y}
                        stroke="#D4A017"
                        strokeWidth="1"
                        strokeOpacity="0.35"
                      />

                      {/* Pulsing halo */}
                      <circle cx={dot.x} cy={dot.y} r="12" fill="#D4A017" fillOpacity="0.12">
                        <animate attributeName="r" values="10;15;10" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                        <animate attributeName="fill-opacity" values="0.12;0.04;0.12" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                      </circle>

                      {/* Dot */}
                      <circle cx={dot.x} cy={dot.y} r="5" fill="#D4A017" />

                      {/* Region name */}
                      <text
                        x={labelX}
                        y={label.y + 1}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fill="#FFF8E7"
                        fontSize="9"
                        fontFamily="sans-serif"
                        fontWeight="600"
                        opacity="0.9"
                      >
                        {region.name}
                      </text>

                      {/* Orders count */}
                      <text
                        x={labelX}
                        y={label.y + 12}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fill="#D4A017"
                        fontSize="7.5"
                        fontFamily="sans-serif"
                        opacity="0.8"
                      >
                        {region.orders.toLocaleString()}+ orders
                      </text>
                    </motion.g>
                  );
                })}

                {/* Centre circle background */}
                <circle cx={CX} cy={CY} r="52" fill="#6B1530" stroke="#D4A017" strokeWidth="1.5" strokeOpacity="0.6" />

                {/* Logo image via foreignObject */}
                <foreignObject x={CX - 40} y={CY - 40} width="80" height="80">
                  <div
                    // @ts-expect-error xmlns needed for SVG foreignObject
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden" }}
                  >
                    <Image
                      src="/images/logo_round.png"
                      alt="Amma's Akshayam"
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </foreignObject>

                {/* Gold border ring over the logo */}
                <circle cx={CX} cy={CY} r="41" fill="none" stroke="#D4A017" strokeWidth="1.5" strokeOpacity="0.7" />
              </svg>
            </div>

            {/* Bottom region chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {tamilNaduRegions.map((region) => (
                <motion.div
                  key={region.name}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 bg-white/8 border border-white/15 rounded-full px-3 py-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <span className="text-xs text-cream/90 font-medium">{region.name}</span>
                  <span className="text-[10px] text-gold-400 font-bold">{region.orders.toLocaleString()}+</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
