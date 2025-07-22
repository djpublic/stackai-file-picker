"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_KNOWLEDGE_BASE_ID = `${process.env.NEXT_PUBLIC_API_KNOWLEDGE_BASE_ID}`;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(`${API_KNOWLEDGE_BASE_ID}`);
  }, [router]);

  return <></>;
}
