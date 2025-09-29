"use client"

import { useQuery } from "@tanstack/react-query"
import { test_api } from "@/api/test-api"
import { useStore } from "@nanostores/react"
import { counter, testUsername } from "@/store"
import { Button } from "@/react/components/ui/button"
import { Smile } from 'lucide-react'

export default function Hello() {
  const name = useStore(testUsername)
  const count = useStore(counter)

  const { data, isPending } = useQuery({
    queryKey: ["hello", name],
    queryFn: () => test_api<{ ok: boolean; message: string; time: string }>({ method: "GET", query: { greet: name } }),
  })

  return (
    <div className="max-w-xl mx-auto p-6 rounded-xl border bg-card text-card-foreground animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Smile className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">{"Hello"}</h1>
      </div>
      <p className="mb-4">
        {"Benvenuto, "}
        <strong>{name}</strong>
        {"! "}
        {isPending ? "Caricamento..." : data?.message}
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => counter.set(count + 1)}>
          {"Incrementa ("}
          {count}
          {")"}
        </Button>
        <Button variant="secondary" onClick={() => counter.set(0)}>
          {"Reset"}
        </Button>
      </div>
    </div>
  )
}
