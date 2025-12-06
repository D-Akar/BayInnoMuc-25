import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const roomName = request.nextUrl.searchParams.get('room') || 'default-room';
    const participantName = request.nextUrl.searchParams.get('username') || 'user-' + Math.random().toString(36).substring(7);

    // Validate environment variables
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing LiveKit credentials' },
        { status: 500 }
      );
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        // Token expires in 1 hour
        ttl: '1h',
      }
    );

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    
    return NextResponse.json({ 
      token,
      url: process.env.LIVEKIT_URL 
    });
    
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}