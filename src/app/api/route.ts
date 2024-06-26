import { API_KEY, API_URL } from '@/config'

/* Proxy to the AlphaVantage API, this avoids
exposing the api key */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  searchParams.set('apikey', API_KEY)

  const apiResponse = await fetch(`${API_URL}?${searchParams}`)

  return new Response(JSON.stringify(await apiResponse.json()), {
    status: apiResponse.status,
    headers: { 'Content-Type': 'application/json' }
  })
}
