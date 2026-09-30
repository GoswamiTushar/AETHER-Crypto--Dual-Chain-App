import { Account } from 'viem';
import { getEvmClients } from './inAppEvmActions';
import tokenData from '@/contracts/AllInOneTokenData.json';

export async function inAppDeployErc20(
  account: Account,
  name: string,
  symbol: string,
  initialSupply: string
) {
  const { walletClient, publicClient } = getEvmClients(account);
  if (!walletClient) throw new Error('No wallet client found');

  const hash = await walletClient.deployContract({
    abi: tokenData.abi as any,
    bytecode: tokenData.bytecode as `0x${string}`,
    args: [name, symbol, BigInt(initialSupply)],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error('Deployment did not yield a valid contract address');
  }

  return {
    contractAddress: receipt.contractAddress,
    txHash: hash,
  };
}
