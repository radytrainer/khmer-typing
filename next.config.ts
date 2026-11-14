import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phaser is a browser-only rendering engine (canvas/WebGL) loaded exclusively through
  // next/dynamic(..., { ssr: false }). Without this, Next's server compiler still tries to
  // trace its exports for the server build graph and emits a harmless but noisy
  // "does not contain a default export" warning on every build.
  serverExternalPackages: ["phaser"],
};

export default nextConfig;
