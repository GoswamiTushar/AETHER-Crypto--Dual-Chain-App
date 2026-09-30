import { Connection, PublicKey, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  createMintToInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';

const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export async function buildCreateMintAndAtaTx(
  connection: Connection, 
  owner: PublicKey,
  name: string = 'Aetherius Coin',
  symbol: string = 'ATH',
  uri: string = 'https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json'
) {
  const mintKeypair = Keypair.generate();
  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  const ata = await getAssociatedTokenAddress(mintKeypair.publicKey, owner);

  // Derive the PDA for the metadata account
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: owner,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(mintKeypair.publicKey, 9, owner, null),
    createAssociatedTokenAccountIdempotentInstruction(owner, ata, owner, mintKeypair.publicKey),
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mintKeypair.publicKey,
        mintAuthority: owner,
        payer: owner,
        updateAuthority: owner,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name,
            symbol,
            uri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        }
      }
    )
  );

  return { tx, mintKeypair, ata };
}

export async function buildMintToTx(mint: PublicKey, owner: PublicKey, recipient: PublicKey, amount: number) {
  const ata = await getAssociatedTokenAddress(mint, recipient);
  const rawAmount = BigInt(Math.floor(amount * 10 ** 9));

  return new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(owner, ata, recipient, mint),
    createMintToInstruction(mint, ata, owner, rawAmount)
  );
}

export async function buildTransferTx(mint: PublicKey, owner: PublicKey, recipient: PublicKey, amount: number) {
  const sourceAta = await getAssociatedTokenAddress(mint, owner);
  const destAta = await getAssociatedTokenAddress(mint, recipient);
  const rawAmount = BigInt(Math.floor(amount * 10 ** 9));

  return new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(owner, destAta, recipient, mint),
    createTransferInstruction(sourceAta, destAta, owner, rawAmount)
  );
}
