import { Connection, PublicKey, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import {
  buildCreateMintAndAtaTx,
  buildMintToTx,
  buildTransferTx,
} from '@/app/_components/solana-panel/transactions';

export async function requestDevnetAirdrop(connection: Connection, pubkey: PublicKey) {
  const sig = await connection.requestAirdrop(pubkey, 1e9);
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: sig,
  });
  return sig;
}

export async function inAppCreateMintAndAta(connection: Connection, payer: Keypair, name: string = 'Aetherius Coin', symbol: string = 'ATH') {
  let uri = 'https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json';

  try {
    const res = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, symbol })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.uri) uri = data.uri;
    }
  } catch (err) {
    console.warn("Failed to generate dynamic metadata, falling back to dummy", err);
  }

  const { tx, mintKeypair } = await buildCreateMintAndAtaTx(connection, payer.publicKey, name, symbol, uri);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer, mintKeypair]);
  return { sig, mintAddress: mintKeypair.publicKey.toBase58() };
}

export async function inAppMintTo(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  amount: number
) {
  const tx = await buildMintToTx(mint, payer.publicKey, payer.publicKey, amount);
  return await sendAndConfirmTransaction(connection, tx, [payer]);
}

export async function inAppTransfer(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  recipient: PublicKey,
  amount: number
) {
  const tx = await buildTransferTx(mint, payer.publicKey, recipient, amount);
  return await sendAndConfirmTransaction(connection, tx, [payer]);
}
