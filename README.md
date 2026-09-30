# Aetherius — Dual-Chain Web3 Workspace & Educational Notebook

Welcome to **Aetherius**, an in-browser workspace for testing, deploying, and interacting with Web3 infrastructure across both **Solana** and **Ethereum** blockchains—without any browser extensions.

This `README.md` serves as both project documentation and a **self-contained educational notebook**. If you have never touched Web3 before, start from the very top and read sequentially. Every concept is explained using a consistent real-world analogy before diving into the technical details, so you can build a mental model first and layer complexity on top.

---

## Before We Start: What Even Is Web3?

In traditional web applications (Web2), there is always a **central authority**:
- Your money lives inside a bank's private database. The bank can freeze your account, reverse transactions, or go bankrupt.
- Your social media posts live on a company's servers. The company can delete your posts, ban your account, or sell your data.
- You trust these intermediaries because you have no alternative.

**Web3 removes the intermediary.** Instead of a private database controlled by one company, your data, money, and digital assets live on a **blockchain**—a public, distributed database that no single entity controls. Instead of a username and password managed by someone else, your identity is a **cryptographic key** that only you hold.

The trade-off: you gain full sovereignty over your assets, but you also take full responsibility. If you lose your keys, nobody can recover your account. There is no "Forgot Password" button.

---

## The Analogy We Use Throughout This Document

To make Web3 concepts intuitive, every explanation in this document uses the same real-world analogy:

**A Global Bank that allows customers to create, print, and send custom Digital Gift Cards.**

| Web3 Concept | Analogy |
|---|---|
| Blockchain | The bank's un-hackable, publicly visible ledger |
| Wallet | Your safe inside the vault |
| Seed Phrase | The master combination code to the vault |
| Private Key | The physical key that opens one specific safe |
| Public Address | Your bank account number |
| Token Mint / Smart Contract | A gift card printing press |
| Minting tokens | Pulling the lever to print new gift cards |
| Transferring tokens | Moving gift cards between accounts |
| Gas fees | The teller's processing fee |

We will reference this analogy consistently across both the Solana and Ethereum sections. The analogy always stays in the "bank" context—we never switch to a different metaphor.

---

# SOLANA (SPL Tokens) — Devnet

---

## Part 1: Solana Core Terminologies

### 1. The Blockchain (Solana Devnet)
* **Analogy:** The bank's central, globally visible, tamper-proof ledger. Every transaction ever made is written in this ledger, and anyone in the world can read it.
* **Beginner Explanation:** Imagine a Google Spreadsheet that the entire world can see, but nobody can edit their own row—only automated bank tellers (programs) can update balances after verifying your identity. Once something is written, it can never be erased or altered.
* **Technical Detail:** A distributed state machine maintained by a global network of validator nodes. Solana orders state transitions cryptographically using **Proof of History (PoH)**—a verifiable delay function that creates a historical record proving that an event occurred at a specific moment in time. This allows validators to agree on the ordering of transactions without exchanging messages back and forth, which is why Solana achieves ~400ms block times. The **Devnet** is a parallel test cluster running the same consensus software but with free, valueless "test" SOL.

### 2. Smart Contract / Program
* **Analogy:** The Automated Bank Teller API—a pre-programmed robot teller that follows a strict set of rules you give it and executes them 24/7 without human intervention.
* **Beginner Explanation:** Think of a vending machine. You insert a coin (pay gas), press a button (send an instruction), and the machine dispenses a product (mutates state). The machine doesn't "remember" anything about you between transactions—it just follows its code. On Solana, these vending machines are called **Programs**.
* **Technical Detail:** On Solana, Smart Contracts are called **Programs**. They are stateless executable byte-code compiled to **eBPF** (extended Berkeley Packet Filter) and deployed into read-only memory on the blockchain. "Stateless" means the Program itself does not store any user data internally. Instead, when you call a Program, you pass it a transaction containing:
  1. **Instruction Data** — the payload telling the Program what to do (e.g., "mint 100 tokens").
  2. **An array of Account references** — pointers to separate on-chain data accounts that the Program is allowed to read from or write to.
  
  The Program validates the instruction, checks permissions, and if everything passes, it mutates the data in those external accounts. If anything fails, the entire transaction reverts atomically—meaning either everything succeeds or nothing changes. There is no partial execution.

### 3. Seed Phrase (BIP-39 Mnemonic)
* **Analogy:** The master combination code to a giant vault building. Anyone who knows this code can access every safe inside.
* **Beginner Explanation:** When you create a crypto wallet, you receive 12 (or 24) random English words like *apple tree ghost umbrella...*. These words ARE your entire identity. They mathematically generate all of your keys across every blockchain. If someone else gets these words, they have complete access to all your assets. If you lose these words, your assets are gone forever. There is no recovery.
* **Technical Detail:** BIP-39 (Bitcoin Improvement Proposal 39) is a standard for converting raw cryptographic randomness into a human-readable format:
  1. The system generates 128 bits of cryptographically secure random entropy (from your browser's `crypto.getRandomValues()`).
  2. A 4-bit checksum (derived by SHA-256 hashing the entropy and taking the first 4 bits) is appended, giving 132 bits total.
  3. This 132-bit string is split into twelve 11-bit chunks.
  4. Each 11-bit chunk (values 0–2047) maps to a specific word in a standardized 2048-word English dictionary.
  5. The result is your 12-word seed phrase.
  
  This means your 12 words encode exactly 128 bits of entropy—the same randomness as a 128-bit AES encryption key.

### 4. Private Key & Keypair
* **Analogy:** The physical metallic key that opens one specific safe inside the vault building. The seed phrase generates the vault; the private key opens one particular safe.
* **Beginner Explanation:** Your private key is a very long secret number. It is mathematically linked to your public address (account number) through a one-way function—like a padlock where you can verify the key fits, but you can't manufacture a key by looking at the padlock. Anyone with your private key can move your funds. Aetherius stores this key **only in your browser tab's temporary memory (RAM)**—when you close or refresh the tab, it vanishes. Nothing is saved to disk, cookies, or local storage.
* **Technical Detail:** Solana uses the **Ed25519** elliptic curve signature scheme (a form of EdDSA — Edwards-curve Digital Signature Algorithm). The derivation process is:
  1. The 12-word mnemonic is converted to a 512-bit master seed using **PBKDF2** with HMAC-SHA512 over 2048 iterations (this is the "seed stretching" step that makes brute-force attacks computationally expensive).
  2. The master seed is run through **SLIP-0010** hierarchical deterministic (HD) derivation using the Solana-specific path `m/44'/501'/0'/0'` (where `44'` = BIP-44 standard, `501'` = Solana's registered coin type).
  3. The output is a 32-byte secret key. A Solana Keypair is a 64-byte array: bytes 0–31 are the secret key, bytes 32–63 are the mathematically derived public key.
  4. The secret key is used to generate Ed25519 signatures that prove ownership without ever revealing the key itself.

### 5. Public Address (Wallet Address)
* **Analogy:** Your bank account number. You share it freely so people can send you money, but knowing the account number alone doesn't let anyone withdraw from your account.
* **Beginner Explanation:** This is the address you give to someone when you want them to send you tokens—like giving someone your email address so they can send you messages, but they can't read your inbox. On Solana, it looks like a random string of letters and numbers: `7NLK...s5s4`.
* **Technical Detail:** The public address is the 32-byte Ed25519 public key, encoded in **Base58** format for human readability. Base58 is similar to Base64 but removes visually ambiguous characters (0, O, I, l) to prevent copy-paste errors. It is computationally infeasible to reverse-engineer the private key from the public address—this would require solving the Elliptic Curve Discrete Logarithm Problem, which has no known efficient solution.

### 6. Token Mint Contract (SPL Token)
* **Analogy:** A custom gift card printing press. The press itself doesn't hold any gift cards—it just has the mold, the authority stamp, and a counter of how many gift cards have been printed total.
* **Beginner Explanation:** When you "Create a Token Mint" in Aetherius, you are registering a new type of token on the Solana blockchain. You become the **Mint Authority**—the only person authorized to print (mint) new tokens of this type. Think of it like applying for a license to print a new brand of gift card.
* **Technical Detail:** A Token Mint is a specific 82-byte data account on the Solana ledger, formatted according to the rules of the native **SPL Token Program** (Program ID: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`). The 82 bytes store:
  - `supply` (u64) — total number of tokens in circulation
  - `decimals` (u8) — how many decimal places the token supports (Aetherius uses 9, so 1 token = 1,000,000,000 smallest units)
  - `mint_authority` (PublicKey) — the wallet authorized to create new tokens
  - `freeze_authority` (Option\<PublicKey\>) — the wallet authorized to freeze token accounts (set to `null` in Aetherius)
  
  The Mint does NOT hold balances. It is purely a registry definition.

### 7. Token Metadata (Metaplex)
* **Analogy:** The label stuck on the printing press that says "Starbucks Gift Card — ★ — www.starbucks.com/info". It gives the gift card a human-readable name, symbol, and description.
* **Beginner Explanation:** A Token Mint only stores numbers (supply, decimals). To give your token a name like "Aetherius" and a symbol like "ATH" that shows up in wallet apps and explorers, you need a separate **Metadata Account**. Aetherius creates this automatically when you deploy a new mint.
* **Technical Detail:** Aetherius uses the **Metaplex Token Metadata Program** (`metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`) to attach on-chain metadata to the Mint. A PDA (Program Derived Address) is computed from `['metadata', METADATA_PROGRAM_ID, mint_pubkey]`, and a `CreateMetadataAccountV3` instruction is bundled into the same transaction as the Mint creation. The metadata includes `name`, `symbol`, and a `uri` pointing to a JSON file with extended metadata (image, description, etc.).

### 8. Associated Token Account (ATA)
* **Analogy:** A designated sub-folder inside your bank account that can ONLY hold one specific brand of gift card. You can't just toss Starbucks cards into your general savings account—the bank requires a separate, labeled folder for each brand.
* **Beginner Explanation:** On Solana, your main wallet cannot hold tokens directly. For every different token you want to hold, you need to open a specific sub-account. This is different from Ethereum (where the contract tracks your balance internally). When you create a Mint in Aetherius, it automatically opens this sub-account for you.
* **Technical Detail:** Solana requires tokens to be held in dedicated data accounts rather than in the wallet itself. An ATA is a **Program Derived Address (PDA)** — a special address that is generated deterministically from your Wallet Address + the Mint Address + the SPL Token Program ID, then mathematically "bumped" off the Ed25519 curve so it has no corresponding private key. This means:
  - The address is predictable and unique (same wallet + same mint = always the same ATA address).
  - No one can sign transactions on behalf of this address — only the SPL Token Program itself can modify the balance.
  - The ATA occupies **165 bytes** of on-chain storage and requires a SOL deposit ("rent exemption") to keep alive.

### 9. Gas Fees & Rent (SOL)
* **Analogy:** The processing fee you pay the bank teller for every transaction, plus a small deposit to keep your sub-folders open.
* **Beginner Explanation:** Every action on the blockchain costs a tiny fee paid in SOL (Solana's native currency). This fee prevents spam (someone sending millions of fake transactions to clog the network). On Devnet, this SOL is free and worthless—you get it from an "airdrop" (faucet). Additionally, storing data on the blockchain costs "rent"—a one-time SOL deposit that keeps your accounts alive permanently.
* **Technical Detail:** Solana transaction fees consist of:
  1. **Base fee** — currently 5,000 lamports (0.000005 SOL) per signature, paid to validators.
  2. **Rent** — a one-time deposit based on the number of bytes stored. For example, a Mint (82 bytes) costs ~0.00145 SOL in rent; an ATA (165 bytes) costs ~0.00204 SOL. If you deposit enough to be "rent-exempt" (which Aetherius always does), the account lives forever without ongoing fees.

---

## Part 2: The Solana Application Flow (Step-by-Step)

Here is the exact sequential flow of what happens when you use Aetherius on the Solana Devnet.

### Step 1: Generating or Importing the In-App Wallet
* **The Action:** On the welcome screen, you either click "Create New Wallet" (generates a fresh identity) or paste an existing Seed Phrase / Solana Private Key to import.
* **The Web2 Example:** You walk into the bank anonymously. You can either ask the automated terminal to generate a brand-new master combination code and account number, or you can present an existing combination code from another bank (import). The bank teller processes it instantly and then forgets you exist—nothing is recorded.
* **What happens technically:** 
  - **Create:** Aetherius calls `generateMnemonic(english)` from `viem/accounts` to produce 128 bits of browser entropy → 12-word mnemonic. It then calls `mnemonicToSeedSync(mnemonic)` from `@scure/bip39` to stretch it into a 512-bit seed, and `derivePath("m/44'/501'/0'/0'", seedHex)` from `ed25519-hd-key` to derive the Solana secret key. Finally, `Keypair.fromSeed(derived.key)` from `@solana/web3.js` creates the full 64-byte Keypair.
  - **Import Seed Phrase:** Same process, but using the user-provided mnemonic instead of generating a new one.
  - **Import Private Key:** The Base58-encoded private key is decoded via `bs58.decode()`, then directly passed to `Keypair.fromSecretKey()`.
  - Both the Solana and Ethereum identities are derived simultaneously from the same seed phrase, using different HD paths.

### Step 2: Securing Devnet Funds (Airdrop)
* **The Action:** You click the "Airdrop SOL" button in the Vault Header.
* **The Web2 Example:** Because this is a practice bank (Devnet), you ask the bank manager for "Monopoly Money" so you can pay the tellers to process your practice transactions. The manager hands you 1 SOL of play money instantly.
* **What happens technically:** Aetherius calls `connection.requestAirdrop(pubkey, 1e9)` from `@solana/web3.js`. This sends an HTTP POST request to the Devnet RPC endpoint (`https://api.devnet.solana.com`). The validator node receives this faucet request, bypasses normal signature checks, and credits 1,000,000,000 lamports (= 1 SOL) to your account. Aetherius then calls `connection.confirmTransaction()` to poll the network until the airdrop is finalized.

### Step 3: Creating a Token Mint + Associated Token Account + Metadata
* **The Action:** You enter a Token Name (e.g., "Aetherius") and Symbol (e.g., "ATH"), then click "Create New Mint & Associated Token Account".
* **The Web2 Example:** You fill out paperwork at the bank to register a brand new gift card printing press. The bank simultaneously opens a dedicated sub-folder in your account to hold those gift cards, and stamps a label on the press with the card's name and logo.
* **What happens technically:** Aetherius builds a single multi-instruction `Transaction` containing FOUR instructions bundled atomically:
  1. **`SystemProgram.createAccount`** — Allocates `MINT_SIZE` (82) bytes of on-chain memory, transfers enough SOL from your wallet to make it rent-exempt, and assigns ownership to the SPL Token Program.
  2. **`createInitializeMintInstruction`** — Formats those 82 bytes as a Mint struct: sets `decimals` to 9, writes your PublicKey as `mint_authority`, sets `freeze_authority` to null.
  3. **`createAssociatedTokenAccountIdempotentInstruction`** — Derives the PDA for your ATA (wallet + mint + token program → SHA-256 → curve bump), allocates 165 bytes, and initializes it. The "idempotent" variant means it silently succeeds even if the ATA already exists, preventing errors on retry.
  4. **`createCreateMetadataAccountV3Instruction`** (Metaplex) — Derives the metadata PDA from `['metadata', METADATA_PROGRAM_ID, mint_pubkey]`, creates the metadata account, and writes `name`, `symbol`, and a `uri` pointing to a JSON file with extended token info.
  
  The transaction is signed by BOTH your wallet Keypair (paying gas + authorizing as mint authority) and the freshly generated Mint Keypair (proving ownership of the new mint address). It is then broadcast via `sendAndConfirmTransaction()`, which serializes, signs, sends, and polls for confirmation in one call.

### Step 4: Minting Tokens to your ATA
* **The Action:** You select your Mint from the dropdown (or paste an external Mint address), enter an amount (e.g., 1,000), and click "Mint to My Associated Token Account".
* **The Web2 Example:** You walk up to your printing press and pull the lever. It prints 1,000 gift cards. The press's internal counter increments by 1,000 (totalSupply), and the 1,000 cards are deposited directly into your designated sub-folder (ATA).
* **What happens technically:** Aetherius builds a `Transaction` with two instructions:
  1. **`createAssociatedTokenAccountIdempotentInstruction`** — Ensures the recipient's ATA exists (a safety measure in case you're minting to a different wallet).
  2. **`createMintToInstruction`** — Specifies the Mint address, destination ATA, mint authority (your PublicKey), and the raw amount (user amount × 10⁹, since decimals = 9). This instruction requires the `mint_authority` to be a **Signer** of the transaction.
  
  The transaction is signed with your Keypair (proving you are the Mint Authority) and broadcast. The SPL Token Program validates the signature, increments the Mint's `supply` field, and credits the tokens to the destination ATA's `amount` field.

### Step 5: Transferring SPL Tokens
* **The Action:** You paste a recipient's Solana address, enter an amount, and click "Send SPL Tokens".
* **The Web2 Example:** You tell the bank teller: "Take 50 gift cards from my sub-folder and put them in my friend's sub-folder." If your friend doesn't have a sub-folder for this brand yet, the teller builds one on the spot (you pay the tiny construction fee).
* **What happens technically:** Aetherius builds a `Transaction` with two instructions:
  1. **`createAssociatedTokenAccountIdempotentInstruction`** — Derives the recipient's ATA from `(recipient_pubkey + mint_pubkey + token_program)` and creates it if it doesn't exist. Because it's the "idempotent" variant, this instruction silently no-ops if the ATA already exists. Your wallet pays the rent deposit for the new ATA.
  2. **`createTransferInstruction`** — Specifies source ATA, destination ATA, owner (your PublicKey), and raw amount. The owner must be a Signer.
  
  The transaction is signed and broadcast. Due to Solana's atomic transaction model, either the ATA is created AND the tokens are moved in the same slot, or the entire transaction fails and nothing changes.

---

## Part 3: Solana Technical Modules — Deep Dive

### 1. `@scure/bip39` & `ed25519-hd-key`
* **Used for:** Step 1 — Wallet Generation & Key Derivation.
* **What they do:**
  - `@scure/bip39` provides `mnemonicToSeedSync(mnemonic)`, which takes the 12-word phrase and runs PBKDF2 with HMAC-SHA512 (2048 iterations) to stretch it into a 512-bit master seed. This is the industry-standard BIP-39 seed derivation.
  - `ed25519-hd-key` provides `derivePath(path, seedHex)`, which implements SLIP-0010 hierarchical deterministic key derivation for Ed25519 curves. It walks the path `m/44'/501'/0'/0'`, performing HMAC-SHA512 at each level to derive child keys, ultimately producing the 32-byte secret key specific to Solana.
  - `Keypair.fromSeed()` from `@solana/web3.js` then wraps this 32-byte seed into the full 64-byte Keypair (secret key + derived public key).

### 2. `@solana/web3.js`
* **Used for:** Step 2 — RPC Connection, Airdrops, Transaction Signing & Broadcasting.
* **What it does:**
  - Establishes a `Connection` object — an HTTP client wrapper that speaks the **JSON-RPC** protocol to communicate with Solana validator nodes.
  - `requestAirdrop(pubkey, lamports)` sends a JSON-RPC `requestAirdrop` call to the Devnet faucet.
  - `sendAndConfirmTransaction(connection, transaction, signers[])` is the workhorse function that: serializes the Transaction into a binary buffer → signs it with each provided Keypair (appending Ed25519 signatures) → sends it via `sendRawTransaction` → polls `getSignatureStatuses` until the transaction is confirmed or fails.

### 3. `@solana/spl-token`
* **Used for:** Steps 3, 4, 5 — Mint Creation, ATA Creation, Minting, Transferring.
* **What it does:**
  - Exports instruction builders (`createInitializeMintInstruction`, `createMintToInstruction`, `createTransferInstruction`, `createAssociatedTokenAccountIdempotentInstruction`) that construct properly formatted binary payloads for the SPL Token Program.
  - Exports `getAssociatedTokenAddress(mint, owner)` which computes the deterministic PDA for any wallet + mint combination using `PublicKey.findProgramAddressSync()`.
  - Exports `getMinimumBalanceForRentExemptMint(connection)` which queries the cluster for the current rent-exemption cost for 82 bytes.

### 4. `@metaplex-foundation/mpl-token-metadata`
* **Used for:** Step 3 — Attaching on-chain metadata to the Mint.
* **What it does:**
  - Exports `createCreateMetadataAccountV3Instruction` which builds the instruction payload for the Metaplex Token Metadata Program. This creates a PDA-based Metadata Account linked to the Mint, storing `name`, `symbol`, `uri`, and other fields that wallet apps and blockchain explorers use to display human-readable token information.

---
---

# ETHEREUM (ERC-20 Tokens) — Sepolia Testnet

The second half of Aetherius operates on the **Ethereum Virtual Machine (EVM)**, specifically the **Sepolia Testnet**. The same Seed Phrase that generated your Solana Keypair also generates your Ethereum Keypair—but the underlying cryptography, account model, and smart contract architecture are fundamentally different.

We continue using the same **Global Bank & Gift Card** analogy, but now the bank branch operates under entirely different internal regulations.

---

## Part 4: Ethereum-Specific Terminologies

### 1. The Blockchain (Ethereum Sepolia)
* **Analogy:** A different branch of the same Global Bank, governed by different internal regulations but serving the same purpose.
* **Beginner Explanation:** Ethereum is another blockchain network, completely separate from Solana. It has its own currency (ETH), its own smart contract language (Solidity), and its own set of rules. Think of it as a different country's banking system—the concepts are the same (accounts, transfers, fees), but the implementation details differ.
* **Technical Detail:** Ethereum is a distributed state machine that maintains a global **Merkle Patricia Trie** data structure. Unlike Solana's Proof of History, Ethereum reaches consensus using **Proof of Stake (PoS)** — validators lock up ETH as collateral ("staking") and are randomly selected to propose and attest to new blocks. Each block (~12 seconds) contains transactions that, when executed by the EVM, produce deterministic state transitions. Sepolia is an Ethereum testnet running the same PoS consensus with free, valueless "test" ETH.

### 2. The Ethereum Virtual Machine (EVM)
* **Analogy:** A shared global computer that all bank tellers run their scripts on, executing one instruction at a time.
* **Beginner Explanation:** Every computer in the Ethereum network runs an identical copy of this virtual machine. When someone deploys a smart contract, the EVM ensures every computer executes it in exactly the same way and gets the same result. It's like a calculator that 10,000 people use simultaneously—they all press the same buttons and see the same answer.
* **Technical Detail:** The EVM is a **stack-based, quasi-Turing-complete** virtual machine. Smart contracts are compiled into low-level **EVM bytecode** — opcodes like `PUSH`, `SSTORE` (write to storage), `SLOAD` (read from storage), `CALL` (invoke another contract). When a transaction invokes a contract, every validator independently executes the same bytecode against the same world state, guaranteeing deterministic output. The "quasi-Turing-complete" qualifier exists because execution is bounded by a **gas limit** — each opcode costs a specific amount of gas, and if execution exhausts the gas budget, the entire transaction reverts.

### 3. Solidity & Smart Contracts
* **Analogy:** The programming language used to write the automated bank teller scripts (like JavaScript is used for websites), and the compiled executable that runs on the shared global computer.
* **Beginner Explanation:** Just like you write a website in JavaScript and deploy it to a server, you write a smart contract in **Solidity** and deploy it to the Ethereum blockchain. Once deployed, the contract lives at a specific address and runs forever—nobody can change or delete it. The compilation process produces two things: the machine code (bytecode) and the instruction manual (ABI) that tells other programs how to talk to it.
* **Technical Detail:** Solidity is a high-level, statically-typed, contract-oriented language. A `.sol` file is compiled by `solc` (the Solidity compiler) into:
  1. **Bytecode** — raw hexadecimal machine code executed by the EVM.
  2. **ABI (Application Binary Interface)** — a JSON schema describing the contract's public functions, parameter types, and return types. The ABI is what allows Aetherius to know how to encode a function call like `mint(0x1234, 1000)` into the raw bytes that the EVM expects. Without the ABI, the contract would be a black box.

### 4. Private Key & Account (secp256k1)
* **Analogy:** The same concept as Solana — the metallic key to your safe — but forged by a completely different locksmith using different techniques.
* **Beginner Explanation:** Your Ethereum private key works exactly like your Solana private key (it proves your identity and lets you authorize transactions), but it uses different math. This is why the same seed phrase generates different addresses on Solana vs Ethereum — the same master combination code opens different safes depending on which branch of the bank you're at.
* **Technical Detail:** Ethereum uses the **secp256k1** elliptic curve with **ECDSA** (Elliptic Curve Digital Signature Algorithm) — the same curve used by Bitcoin. Key derivation from the BIP-39 seed uses the Ethereum-specific HD path `m/44'/60'/0'/0/0` (coin type `60` for Ethereum vs `501` for Solana). The 32-byte private key is derived, then secp256k1 point multiplication produces a 64-byte uncompressed public key. The Ethereum **address** is the last 20 bytes of the **Keccak-256** hash of this public key, prefixed with `0x` — resulting in the familiar `0x1A2B...cDeF` format.

### 5. ERC-20 Token Standard
* **Analogy:** A globally agreed-upon gift card template specification. All printing presses in this bank branch must build cards that follow the same template, ensuring every card is compatible with every card reader.
* **Beginner Explanation:** ERC-20 is just a set of rules that say "every token contract must have these functions: `balanceOf`, `transfer`, `approve`, `mint`, etc." It's like a USB standard — if every device follows the same plug specification, they all work together. Any wallet, exchange, or app can interact with any ERC-20 token because they all speak the same language.
* **Technical Detail:** ERC-20 (Ethereum Request for Comment 20) defines a standard interface: `balanceOf(address)`, `transfer(address, uint256)`, `approve(address, uint256)`, `transferFrom(address, address, uint256)`, `totalSupply()`, and events `Transfer` and `Approval`. A critical architectural difference from Solana: on Ethereum, **each token is its own independent smart contract** with its own copy of the token logic. On Solana, all tokens share a single SPL Token Program and only differ in their data accounts.

### 6. Balance Storage: Mappings vs. ATAs
* **Analogy (Solana):** Each customer opens a separate physical sub-folder per gift card brand. No folder = you can't receive that card.
* **Analogy (Ethereum):** The printing press itself maintains an internal spreadsheet with a row for every possible account number. Everyone starts at zero. No folder creation needed.
* **Beginner Explanation:** This is the biggest practical difference between the two chains. On Solana, before someone can receive your token, they (or you) must first create an ATA for them — this costs a small SOL deposit. On Ethereum, the contract already has a "row" for every possible address (defaulting to 0 balance), so you can send tokens to anyone instantly without any setup.
* **Technical Detail:** 
  - **Solana:** Balances live in separate on-chain ATA accounts (165 bytes each), owned by the user's wallet. The SPL Token Program reads/writes to these external accounts.
  - **Ethereum:** Balances are stored **inside the ERC-20 contract** as `mapping(address => uint256)` — a hash table in the contract's persistent storage. When `balanceOf(0x1234)` is called, the EVM computes `keccak256(abi.encode(address, storageSlot))` to locate the exact 32-byte storage position where that user's balance lives. Mappings implicitly initialize every key to zero, so no account creation is ever needed.

### 7. Gas Fees (ETH) & The Gas Model
* **Analogy:** Same concept as Solana — a processing fee — but calculated using a metered taxi billing model instead of a flat bus fare.
* **Beginner Explanation:** On Solana, transaction fees are nearly fixed and extremely cheap (~0.000005 SOL). On Ethereum, fees depend on how complex your transaction is (more computation = more gas) and how busy the network is (more demand = higher price per gas unit). It's like a taxi meter: a short ride on an empty road is cheap, but a long ride during rush hour is expensive.
* **Technical Detail:** Ethereum's gas model is **metered per opcode**: `SSTORE` (write to storage) costs 20,000 gas, `ADD` costs 3 gas, etc. Total gas consumed × gas price = fee in ETH. Post-**EIP-1559**, gas pricing has two components:
  - **Base fee** — algorithmically adjusted per block based on congestion, and **burned** (destroyed), making ETH deflationary.
  - **Priority tip** — an optional incentive paid directly to the validator who includes your transaction.
  
  Gas is measured in **Gwei** (1 ETH = 1,000,000,000 Gwei = 10¹⁸ Wei).

---

## Part 5: The Ethereum Application Flow (Step-by-Step)

### Step 1: Deriving the Ethereum Keypair
* **The Action:** When you import a Seed Phrase or create a new wallet, your Ethereum identity is generated simultaneously alongside the Solana identity.
* **The Web2 Example:** The same master combination code you used at the Solana branch also works at the Ethereum branch — but when you insert it, a completely different safe (built by a different locksmith using secp256k1 instead of Ed25519) opens, containing a different account number.
* **What happens technically:** Aetherius calls `mnemonicToAccount(mnemonic, { path: "m/44'/60'/0'/0/0" })` from `viem/accounts`. Internally, viem stretches the mnemonic into a 512-bit seed via PBKDF2 (HMAC-SHA512, 2048 iterations), then performs HMAC-SHA512 hierarchical derivation down the Ethereum path. It produces a 32-byte secp256k1 private key → derives the 64-byte uncompressed public key via elliptic curve point multiplication → hashes it with Keccak-256 → takes the last 20 bytes as the `0x...` Ethereum address.

### Step 2: Funding with Sepolia ETH
* **The Action:** You click "Get ETH (Faucet)" in the EVM panel.
* **The Web2 Example:** Unlike the Solana branch where you could ask the teller for Monopoly money instantly, this Ethereum branch requires you to walk across the street to a third-party kiosk, hand them your account number, and they deposit the test money for you.
* **What happens technically:** Aetherius copies your `0x...` address to your clipboard and opens the **Google Cloud Sepolia Faucet** in a new browser tab. You paste your address there and request free Sepolia ETH. Unlike Solana, Ethereum testnets do not offer programmatic airdrops — faucets require CAPTCHAs or Google authentication to prevent abuse.

### Step 3: Deploying an ERC-20 Smart Contract
* **The Action:** You click "+ Deploy Custom Token", enter a Token Name, Symbol, and Initial Supply, then click "Deploy to Sepolia".
* **The Web2 Example:** Instead of simply registering a printing press with the bank (like Solana), you actually hire a contractor to **build an entirely new autonomous printing press from scratch** inside the bank. This press has its own built-in spreadsheet tracking everyone's balances, its own rules for minting and transferring, and it runs independently forever once installed. On Solana, all tokens share a single government-issued printing mechanism (SPL Token Program). On Ethereum, every token has its own private machine.
* **What happens technically:** Aetherius constructs a **contract creation transaction**:
  1. Loads the pre-compiled Solidity bytecode from `contracts/AllInOneTokenData.json` (the output of compiling `AllInOneToken.sol`).
  2. ABI-encodes the constructor arguments (`name`, `symbol`, `initialSupply`) and appends them to the bytecode.
  3. Sets the transaction's `to` field to `null` — this signals the EVM that this is a deployment, not a function call.
  4. Signs and broadcasts the transaction.
  5. The EVM allocates a new contract address computed as `keccak256(rlp([sender_address, nonce]))[12:]` — the last 20 bytes of the RLP-encoded hash of your address and transaction count.
  6. The EVM executes the constructor bytecode, stores the **runtime bytecode** permanently at the new address, and runs the constructor's side effects (minting `initialSupply * 10^18` tokens to `msg.sender`).
  7. Aetherius calls `publicClient.waitForTransactionReceipt({ hash })` to poll until the deployment is confirmed, then extracts `receipt.contractAddress`.

### Step 4: Interacting with an External Contract (Remix IDE)
* **The Action:** You paste any existing ERC-20 contract address into the "Active Contract Address" input field.
* **The Web2 Example:** Instead of building your own printing press, you walk up to someone else's press already installed in the bank and use it — assuming they gave you permission.
* **What happens technically:** Aetherius uses `publicClient.readContract()` to call the contract's `symbol()`, `decimals()`, and `balanceOf(yourAddress)` view functions via JSON-RPC `eth_call`. These are read-only calls that cost zero gas. The panel dynamically updates to display the external contract's token name, symbol, and your balance.

### Step 5: Minting ERC-20 Tokens
* **The Action:** You enter a recipient address and amount, then click "Mint Tokens".
* **The Web2 Example:** You pull the lever on your printing press. It prints 1,000 gift cards and updates its internal spreadsheet, adding 1,000 to your row.
* **What happens technically:** Aetherius calls `walletClient.writeContract()` targeting the `mint(address, uint256)` function. Viem:
  1. Computes the **function selector**: first 4 bytes of `keccak256("mint(address,uint256)")` = `0x40c10f19`.
  2. ABI-encodes the arguments (recipient address padded to 32 bytes + amount as uint256).
  3. Concatenates selector + encoded args into the transaction's `data` field.
  4. Signs locally with ECDSA on secp256k1, producing `v`, `r`, `s` signature components.
  5. Broadcasts via `eth_sendRawTransaction`.
  
  The EVM executes `_mint()`, which increments `totalSupply` and `_balances[to]` in the contract's storage mapping, then emits a `Transfer` event from `address(0)`.

### Step 6: Transferring ERC-20 Tokens
* **The Action:** You enter a recipient `0x...` address and amount, then click "Send Tokens".
* **The Web2 Example:** You instruct the printing press to update its spreadsheet: subtract 50 from your row, add 50 to your friend's row. Unlike the Solana branch, you do NOT need to check if your friend has a sub-folder — the spreadsheet already has a row for every possible account number (defaulting to zero).
* **What happens technically:** Aetherius calls `transfer(address, uint256)` on the contract. The EVM executes `_transfer()`, which:
  1. Validates `_balances[msg.sender] >= amount` (reverts with "ERC20: transfer exceeds balance" if not).
  2. Decrements `_balances[from]` and increments `_balances[to]` in the storage mapping.
  3. Emits a `Transfer` event.
  
  No intermediate account creation is needed — Ethereum's mapping model implicitly initializes every address to zero.

---

## Part 6: Ethereum Technical Modules — Deep Dive

### 1. `viem/accounts` (Ethereum Key Derivation)
* **Used for:** Step 1 — Ethereum Keypair Derivation.
* **What it does:** `mnemonicToAccount(mnemonic)` takes the 12-word phrase and produces a full Ethereum `HDAccount` object. Internally:
  1. Stretches the mnemonic into a 512-bit seed via PBKDF2 (HMAC-SHA512, 2048 iterations).
  2. Performs HMAC-SHA512 hierarchical derivation down `m/44'/60'/0'/0/0`, splitting each 64-byte output into a 32-byte child key + 32-byte chain code.
  3. The final 32-byte key becomes the secp256k1 private key.
  4. Elliptic curve scalar multiplication derives the 64-byte uncompressed public key.
  5. Keccak-256 hash → last 20 bytes → `0x`-prefixed Ethereum address.

### 2. `viem` (Public & Wallet Clients)
* **Used for:** Steps 2–6 — All RPC communication and transaction signing.
* **What it does:** Viem provides two client types:
  * **`createPublicClient`** — A read-only JSON-RPC wrapper connected to the Sepolia RPC endpoint (default: `https://ethereum-sepolia-rpc.publicnode.com`). Methods like `readContract` ABI-encode a function call, send it via `eth_call`, and ABI-decode the response. `getBalance` fetches native ETH via `eth_getBalance`.
  * **`createWalletClient`** — A signing-capable client holding your `Account` object. When `writeContract` is called, viem internally:
    1. ABI-encodes function name + arguments into calldata.
    2. Estimates gas via `eth_estimateGas`.
    3. Fetches current nonce via `eth_getTransactionCount`.
    4. Fetches gas price via `eth_maxPriorityFeePerGas` + base fee from latest block.
    5. Constructs an **EIP-1559** transaction envelope.
    6. Signs locally using secp256k1 ECDSA → `v`, `r`, `s` signature values.
    7. Broadcasts via `eth_sendRawTransaction`.
    8. Returns the transaction hash.

### 3. `viem` — Contract Deployment
* **Used for:** Step 3 — Deploying ERC-20 contracts.
* **What it does:** `walletClient.deployContract({ abi, bytecode, args })`:
  1. ABI-encodes constructor arguments from the ABI's constructor definition.
  2. Concatenates compiled bytecode + encoded constructor args → transaction `data` field.
  3. Sets `to: null` (signals contract creation to the EVM).
  4. Signs, broadcasts, returns hash.
  5. The EVM computes the new address as `keccak256(rlp([sender, nonce]))[12:]`.
  6. Executes constructor → stores runtime bytecode permanently.
  7. `waitForTransactionReceipt` polls until mined → returns `receipt.contractAddress`.

### 4. `AllInOneToken.sol` — The Solidity Contract
* **Used for:** The actual ERC-20 contract deployed and interacted with.
* **What it contains:** A self-contained ERC-20 implementation (no OpenZeppelin dependency):
  - **State:** `name`, `symbol`, `decimals` (18), `totalSupply`, `_balances` mapping, `_allowances` nested mapping.
  - **Constructor:** Accepts `(name, symbol, initialSupply)`. Pre-mints `initialSupply × 10¹⁸` tokens to the deployer.
  - **`mint(to, amount)`:** Public function (no access control — this is a dev/test contract). Increments `totalSupply` + `_balances[to]`, emits `Transfer` from `address(0)`.
  - **`transfer(to, amount)`:** Validates balance, decrements sender, increments recipient, emits `Transfer`.
  - **`approve` / `transferFrom`:** Implements the allowance pattern for delegated spending (e.g., letting a DEX trade tokens on your behalf).

---

## Side-by-Side Comparison: Solana vs. Ethereum

| Aspect | Solana (SPL Tokens) | Ethereum (ERC-20) |
|---|---|---|
| **Consensus** | Proof of History (PoH) + Tower BFT | Proof of Stake (PoS, Casper FFG) |
| **Elliptic Curve** | Ed25519 (EdDSA) | secp256k1 (ECDSA) |
| **HD Derivation Path** | `m/44'/501'/0'/0'` | `m/44'/60'/0'/0/0` |
| **Address Format** | Base58-encoded 32-byte Public Key | `0x` + last 20 bytes of Keccak-256(PubKey) |
| **Smart Contract Model** | Stateless Programs (eBPF) + External Data Accounts | Stateful Contracts (EVM bytecode) with internal storage |
| **Contract Language** | Rust (compiled to BPF) | Solidity (compiled to EVM bytecode) |
| **Token Logic** | Single shared SPL Token Program for all tokens | Each token = its own independently deployed contract |
| **Balance Storage** | Separate Associated Token Accounts (ATAs) per user per token | Internal `mapping(address => uint256)` inside the contract |
| **Account Creation** | Must create ATA before receiving tokens (costs rent) | No account creation needed (mapping defaults to 0) |
| **Token Metadata** | Metaplex Token Metadata Program (separate PDA) | Stored inside the contract itself (`name()`, `symbol()`) |
| **Gas Currency** | SOL (1 SOL = 10⁹ lamports) | ETH (1 ETH = 10⁹ Gwei = 10¹⁸ Wei) |
| **Gas Pricing** | Near-fixed base fee (~0.000005 SOL) | Variable, market-driven (EIP-1559 base fee + tip) |
| **Testnet Faucet** | Programmatic (`requestAirdrop` via RPC) | Manual (CAPTCHA-gated external faucets) |
| **Block / Slot Time** | ~400ms | ~12 seconds |
| **Key Derivation Module** | `@scure/bip39` + `ed25519-hd-key` | `viem/accounts` (built-in) |
| **RPC Module** | `@solana/web3.js` | `viem` |
| **Token Module** | `@solana/spl-token` | `viem` (ABI encoding + direct contract calls) |
