import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, symbol } = body;

    const metadata = {
      name: name || "Aetherius Coin",
      symbol: symbol || "ATH",
      description: "A dual-chain token managed by Aetherius Vault.",
      image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
    };

    const response = await fetch('https://bytebin.lucko.me/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error(`Failed to upload to bytebin: ${response.statusText}`);
    }

    const data = await response.json();
    const uri = `https://bytebin.lucko.me/${data.key}`;

    return NextResponse.json({ uri });
  } catch (error: any) {
    console.error("Metadata upload error:", error);
    return NextResponse.json(
      { error: 'Failed to generate metadata URI' },
      { status: 500 }
    );
  }
}
