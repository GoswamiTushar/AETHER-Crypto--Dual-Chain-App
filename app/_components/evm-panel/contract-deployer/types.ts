export interface ContractDeployerViewProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tokenName: string;
  setTokenName: (name: string) => void;
  tokenSymbol: string;
  setTokenSymbol: (sym: string) => void;
  initialSupply: string;
  setInitialSupply: (supply: string) => void;
  isDeploying: boolean;
  onDeploy: () => void;
  deployedAddress?: string;
  error?: string;
}
