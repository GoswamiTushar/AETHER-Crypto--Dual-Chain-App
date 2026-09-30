export interface EvmPanelViewProps {
  isConnected: boolean;
  address?: `0x${string}`;
  contractAddress: string;
  symbol: string;
  balance: string;
  mintTo: string;
  setMintTo: (val: string) => void;
  mintAmount: string;
  setMintAmount: (val: string) => void;
  onMint: () => void;
  sendTo: string;
  setSendTo: (val: string) => void;
  sendAmount: string;
  setSendAmount: (val: string) => void;
  onSend: () => void;
  isProcessing: boolean;
  txHash?: `0x${string}`;
  onContractAddressChange: (val: string) => void;
}
