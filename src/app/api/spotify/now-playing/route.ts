import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
    cache: 'no-store',
  })
  return response.json()
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken()

    const nowPlayingRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: 'no-store',
      }
    )

    if (nowPlayingRes.status === 200) {
      const data = await nowPlayingRes.json()
      if (data.item) {
        return NextResponse.json({
          isPlaying: data.is_playing,
          title: data.item.name,
          artist: data.item.artists.map((a: { name: string }) => a.name).join(', '),
          album: data.item.album.name,
          albumArt: data.item.album.images[0]?.url,
          url: data.item.external_urls.spotify,
        })
      }
    }

    const recentRes = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: 'no-store',
      }
    )
    const recentData = await recentRes.json()
    const track = recentData.items?.[0]?.track

    if (track) {
      return NextResponse.json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url,
        url: track.external_urls.spotify,
      })
    }

    return NextResponse.json({ isPlaying: false, title: null })
  } catch {
    return NextResponse.json({ isPlaying: false, title: null })
  }
}
