import { createWalletClient, createPublicClient, http, parseUnits, Account } from 'viem';
import { sepolia } from 'viem/chains';
import { SEPOLIA_CONTRACT_ADDRESS, ERC20_ABI } from '@/config/contracts';
import { formatTokenAmount } from '@/utils/formatTokenAmount';

const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';

export function getEvmClients(account?: Account) {
  const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });
  const walletClient = account
    ? createWalletClient({ account, chain: sepolia, transport: http(rpcUrl) })
    : null;
  return { publicClient, walletClient };
}

export async function fetchInAppEvmInfo(address: `0x${string}`, target = SEPOLIA_CONTRACT_ADDRESS) {
  const { publicClient } = getEvmClients();
  const [dec, bal, sym, nativeBal] = await Promise.all([
    publicClient.readContract({ address: target, abi: ERC20_ABI, functionName: 'decimals' }).catch(() => 18),
    publicClient.readContract({ address: target, abi: ERC20_ABI, functionName: 'balanceOf', args: [address] }).catch(() => BigInt(0)),
    publicClient.readContract({ address: target, abi: ERC20_ABI, functionName: 'symbol' }).catch(() => 'ATK'),
    publicClient.getBalance({ address }).catch(() => BigInt(0)),
  ]);
  return {
    symbol: String(sym),
    balance: formatTokenAmount(bal as bigint, dec as number),
    nativeBalance: formatTokenAmount(nativeBal, 18),
  };
}

export async function inAppEvmMint(account: Account, to: `0x${string}`, amount: string, target = SEPOLIA_CONTRACT_ADDRESS) {
  const { publicClient, walletClient } = getEvmClients(account);
  if (!walletClient) throw new Error('No in-app wallet client');
  const hash = await walletClient.writeContract({
    address: target,
    abi: ERC20_ABI,
    functionName: 'mint',
    args: [to, parseUnits(amount, 18)],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}

export async function inAppEvmSend(account: Account, to: `0x${string}`, amount: string, target = SEPOLIA_CONTRACT_ADDRESS) {
  const { publicClient, walletClient } = getEvmClients(account);
  if (!walletClient) throw new Error('No in-app wallet client');
  const hash = await walletClient.writeContract({
    address: target,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [to, parseUnits(amount, 18)],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}
