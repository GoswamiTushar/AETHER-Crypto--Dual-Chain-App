export interface SolanaPanelViewProps {
  connected: boolean;
  publicKeyStr?: string;
  mintAddress: string;
  setMintAddress: (val: string) => void;
  availableMints: string[];
  tokenName: string;
  setTokenName: (val: string) => void;
  tokenSymbol: string;
  setTokenSymbol: (val: string) => void;
  balance: string;
  nativeBalance: string;
  loading: boolean;
  txSig?: string;
  error?: string;
  onCreateMintAndAta: () => void;
  mintAmount: string;
  setMintAmount: (val: string) => void;
  onMintToAta: () => void;
  sendTo: string;
  setSendTo: (val: string) => void;
  sendAmount: string;
  setSendAmount: (val: string) => void;
  onTransfer: () => void;
}
