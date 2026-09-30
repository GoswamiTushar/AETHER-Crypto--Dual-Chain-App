import { generateMnemonic, mnemonicToAccount, english, HDAccount, PrivateKeyAccount, privateKeyToAccount } from 'viem/accounts';
import { mnemonicToSeedSync } from '@scure/bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export interface DualChainWallet {
  mnemonic?: string;
  evm?: {
    address: `0x${string}`;
    derivationPath: string;
    account: HDAccount | PrivateKeyAccount;
    privateKey: string;
  };
  solana?: {
    address: string;
    derivationPath: string;
    keypair: Keypair;
    privateKey: string;
  };
}

export const EVM_DERIVATION_PATH = "m/44'/60'/0'/0/0";
export const SOLANA_DERIVATION_PATH = "m/44'/501'/0'/0'";

export function generateDualChainWallet(existingMnemonic?: string): DualChainWallet {
  const mnemonic = existingMnemonic?.trim() || generateMnemonic(english);
  
  // 1. Derive EVM Account (BIP-44: m/44'/60'/0'/0/0)
  const evmAccount = mnemonicToAccount(mnemonic, { path: EVM_DERIVATION_PATH as `m/44'/60'/${string}` });
  const evmPrivateKey = Buffer.from((evmAccount as any).getHdKey().privateKey).toString('hex');

  // 2. Derive Solana Keypair (BIP-44: m/44'/501'/0'/0')
  const seed = mnemonicToSeedSync(mnemonic);
  const seedHex = Buffer.from(seed).toString('hex');
  const derived = derivePath(SOLANA_DERIVATION_PATH, seedHex);
  const solKeypair = Keypair.fromSeed(derived.key);

  return {
    mnemonic,
    evm: {
      address: evmAccount.address,
      derivationPath: EVM_DERIVATION_PATH,
      account: evmAccount,
      privateKey: `0x${evmPrivateKey}`,
    },
    solana: {
      address: solKeypair.publicKey.toBase58(),
      derivationPath: SOLANA_DERIVATION_PATH,
      keypair: solKeypair,
      privateKey: bs58.encode(solKeypair.secretKey),
    },
  };
}

export function importEvmPrivateKey(privateKeyHex: string): DualChainWallet {
  let hex = privateKeyHex.trim();
  if (!hex.startsWith('0x')) hex = `0x${hex}`;
  
  const evmAccount = privateKeyToAccount(hex as `0x${string}`);
  
  return {
    evm: {
      address: evmAccount.address,
      derivationPath: 'Imported Private Key',
      account: evmAccount,
      privateKey: hex,
    }
  };
}

export function importSolanaPrivateKey(privateKeyBs58: string): DualChainWallet {
  const secretKey = bs58.decode(privateKeyBs58.trim());
  const solKeypair = Keypair.fromSecretKey(secretKey);

  return {
    solana: {
      address: solKeypair.publicKey.toBase58(),
      derivationPath: 'Imported Private Key',
      keypair: solKeypair,
      privateKey: privateKeyBs58.trim(),
    }
  };
}
