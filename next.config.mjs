import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 상위 폴더의 lockfile 을 워크스페이스 루트로 잘못 잡는 경고 방지
  outputFileTracingRoot: __dirname,
  images: { unoptimized: true },
};

export default nextConfig;
