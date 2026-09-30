'use client';

import React from 'react';

interface AetheriusLogoProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
  animated?: boolean;
}

/**
 * Aetherius Logo — Custom Bespoke Dual-Chain Emblem
 * 
 * Symbolism:
 * - The Crystalline Octahedron & "Æ" Monogram: The celestial fifth element (Aether).
 * - Dual Interlocking Prisms:
 *   • Left Cyan/Azure facet: Ethereum Virtual Machine (EVM)
 *   • Right Violet/Fuchsia facet: Solana Virtual Machine (SVM)
 * - The Celestial Core: Central luminous diamond singularity representing
 *   the unified, zero-dependency cryptographic seed derivation.
 */
export function AetheriusLogo({
  size = 32,
  className = '',
  withGlow = false,
  animated = false,
}: AetheriusLogoProps) {
  const idPrefix = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Optional ambient celestial glow behind the emblem */}
      {withGlow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-60 blur-md transition-opacity"
          style={{
            background:
              'radial-gradient(circle at 45% 45%, rgba(56, 189, 248, 0.35) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(236, 72, 153, 0) 75%)',
            transform: 'scale(1.4)',
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 overflow-visible ${
          animated ? 'transition-transform duration-300 hover:scale-105' : ''
        }`}
      >
        <defs>
          {/* Ethereum EVM Gradient — Azure / Electric Cyan / Deep Indigo */}
          <linearGradient
            id={`${idPrefix}-evmGrad`}
            x1="15"
            y1="10"
            x2="55"
            y2="85"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>

          {/* Solana SVM Gradient — Violet / Fuchsia / Neon Pink */}
          <linearGradient
            id={`${idPrefix}-solGrad`}
            x1="85"
            y1="10"
            x2="45"
            y2="85"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>

          {/* Accent Bevel Light Highlights */}
          <linearGradient
            id={`${idPrefix}-topHighlight`}
            x1="50"
            y1="6"
            x2="50"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.1" />
          </linearGradient>

          {/* Central Singularity Glow */}
          <radialGradient
            id={`${idPrefix}-coreGlow`}
            cx="50"
            cy="50"
            r="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#C084FC" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Subtle Outer Drop Filter */}
          <filter
            id={`${idPrefix}-shadow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#000000"
              floodOpacity="0.6"
            />
          </filter>
        </defs>

        <g filter={`url(#${idPrefix}-shadow)`}>
          {/* BACK LAYER: Upper Apex Prism (The 'A' Summit) */}
          <path
            d="M 50 6 L 68 28 L 50 21 L 32 28 Z"
            fill={`url(#${idPrefix}-topHighlight)`}
            stroke="#FFFFFF"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />

          {/* LEFT WING (EVM - Ethereum Strand)
              Spans from summit, through left perimeter, folding into the core */}
          <path
            d="M 50 21 L 32 28 L 14 50 L 32 72 L 46 58 L 30 50 L 40 38 L 50 21 Z"
            fill={`url(#${idPrefix}-evmGrad)`}
            fillOpacity="0.85"
            stroke="#38BDF8"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />

          {/* RIGHT WING (SVM - Solana Strand)
              Spans from summit, through right perimeter, folding into the core */}
          <path
            d="M 50 21 L 68 28 L 86 50 L 68 72 L 54 58 L 70 50 L 60 38 L 50 21 Z"
            fill={`url(#${idPrefix}-solGrad)`}
            fillOpacity="0.85"
            stroke="#E879F9"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />

          {/* LOWER APEX PRISM: Convergence of both chains at base */}
          <path
            d="M 32 72 L 50 94 L 68 72 L 50 64 Z"
            fill="#09090B"
            stroke="#3F3F46"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
          {/* Lower dual facets for light reflection */}
          <path
            d="M 32 72 L 50 94 L 50 64 Z"
            fill="#1E1B4B"
            fillOpacity="0.8"
            stroke="#6366F1"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <path
            d="M 50 94 L 68 72 L 50 64 Z"
            fill="#4A044E"
            fillOpacity="0.8"
            stroke="#EC4899"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* INNER CELESTIAL CRYSTAL (Möbius Cross Nexus)
              Interlocking diamond in the center */}
          <path
            d="M 50 36 L 64 50 L 50 64 L 36 50 Z"
            fill="#07070B"
            stroke="#52525B"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />

          {/* INTERNAL RADIANT STARBURST / AETHER SPARK */}
          <circle cx="50" cy="50" r="10" fill={`url(#${idPrefix}-coreGlow)`} />

          {/* Micro 4-point stellar singularity */}
          <path
            d="M 50 42 Q 50 50 42 50 Q 50 50 50 58 Q 50 50 58 50 Q 50 50 50 42 Z"
            fill="#FFFFFF"
          />
          <circle cx="50" cy="50" r="1.5" fill="#FFFFFF" />

          {/* Subtle Cryptographic Orbital Nodes */}
          {/* EVM Node */}
          <circle cx="14" cy="50" r="2.2" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="0.75" />
          {/* SVM Node */}
          <circle cx="86" cy="50" r="2.2" fill="#EC4899" stroke="#701A75" strokeWidth="0.75" />
          {/* Summit Celestial Node */}
          <circle cx="50" cy="6" r="2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="0.75" />
          {/* Foundation Node */}
          <circle cx="50" cy="94" r="2" fill="#A855F7" stroke="#3B0764" strokeWidth="0.75" />
        </g>
      </svg>
    </div>
  );
}
