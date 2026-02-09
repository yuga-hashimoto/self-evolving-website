"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RandomPage() {
  const router = useRouter();

  useEffect(() => {
    const paths = ["/", "/models/mimo", "/models/grok", "/changelogs/compare"];
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    router.replace(randomPath);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a] text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 animate-pulse">Evolving...</h1>
        <p className="text-gray-400">Picking a random timeline for you.</p>
      </div>
    </div>
  );
}
