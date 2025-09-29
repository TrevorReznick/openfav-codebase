export type TestApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  path?: string
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}

export async function test_api<T = unknown>(opts: TestApiOptions = {}): Promise<T> {
  const { method = "GET", path = "/api/v1/main/doQueries", body, query, headers = {} } = opts
  const qp = query
    ? "?" + new URLSearchParams(Object.entries(query).reduce((acc, [k, v]) => (v !== undefined ? { ...acc, [k]: String(v) } : acc), {} as Record<string, string>)).toString()
    : ""
  const res = await fetch(`${path}${qp}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error (${res.status}): ${text}`)
  }
  return res.json() as Promise<T>
}
