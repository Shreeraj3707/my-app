import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'MyApp - The Future of Web';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ color: '#6366f1', fontWeight: 'bold' }}>MyApp</div>
        <div style={{ fontSize: 48, color: '#a3a3a3', marginTop: 20 }}>
          Built with Next.js 16 & Supabase
        </div>
      </div>
    ),
    { ...size }
  );
}