import { ERC20_ABI } from './erc20Abi';

export const SEPOLIA_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS ||
  '0x382B408c3731E8603358AAEd7EDc785b5480A843'
) as `0x${string}`;

export const SEPOLIA_CHAIN_ID = 11155111;

export { ERC20_ABI };
