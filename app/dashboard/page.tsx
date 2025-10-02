"use client";

import { useEffect, useState } from "react";

export default function ProtectedPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setData(json)).catch((error)=>{
        console.log(`error`, error)
      })
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Dashboard Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
