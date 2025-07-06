# Framino Backend

A TypeScript-based REST API backend for the Framino NFT platform, built with Express.js and TSOA for automatic API documentation and route generation.

## Overview

Framino is a blockchain-based application that enables users to mint, manage, and redeem NFTs representing seasonal pilgrimage journeys. The backend provides APIs for NFT operations, USDC donations, and smart contract interactions on the Arbitrum Sepolia testnet.

## Tech Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Primary programming language
- **Express.js** - Web framework
- **TSOA** - TypeScript API generator for automatic route generation and OpenAPI documentation

### Blockchain Integration
- **Ethers.js v6** - Ethereum library for smart contract interactions
- **Viem v2** - TypeScript interface for Ethereum with Account Abstraction support
- **EIP-7702** - Smart account implementation for gasless transactions
- **ERC-1155** - Multi-token standard for NFTs

### Development Tools
- **ts-node** - TypeScript execution environment
- **Nodemon** - Development server with hot reload
- **Swagger UI** - API documentation interface
- **dotenv** - Environment variable management

### Testing & Utilities
- **NYC** - Code coverage tool
- **Istanbul** - Test coverage configuration

## Project Structure

```
src/
├── server.ts              # Main application entry point
├── routes.ts              # Auto-generated TSOA routes
├── swagger.json           # Auto-generated API documentation
├── abi/
│   └── FraminoNFT.json   # Smart contract ABI
├── contract/
│   └── framino.sol       # ERC-1155 smart contract source
├── controller/
│   └── framinoController.ts # API endpoints controller
├── model/
│   └── framinoModel.ts   # TypeScript interfaces and data models
└── service/
    ├── framinoService.ts # Core business logic and blockchain interactions
    └── permitService.ts  # EIP-2612 permit signature utilities
```

## API Endpoints

### NFT Operations
- `POST /framino/mint-with-paymaster` - Mint new NFTs with gasless transactions
- `POST /framino/mark-completed-with-paymaster` - Mark pilgrimage as completed
- `POST /framino/redeem-with-paymaster` - Redeem NFT balance

### Donations
- `POST /framino/donate-USDC-with-paymaster` - Donate USDC with gasless transactions

### Contract Information
- `GET /framino/contract` - Get smart contract address and ABI

### Documentation
- `GET /api-docs` - Swagger UI documentation

## Key Features

### Account Abstraction (EIP-7702)
- Gasless transactions using paymaster
- Smart account implementation for improved UX
- EIP-2612 permit signatures for token approvals

### NFT System
- **Token IDs 0-3**: Uncompleted seasonal NFTs (Spring, Summer, Autumn, Winter)
- **Token IDs 4-7**: Completed seasonal NFTs (Spring, Summer, Autumn, Winter)
- Custom metadata URIs per user and token
- Redeemable balance system
- Completion status tracking

### Smart Contract Features
- ERC-1155 multi-token standard
- Owner-controlled minting and operations
- Custom URI management per user
- Redeemable balance tracking
- Completion status for pilgrimage journeys

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000

# Blockchain Configuration
PROVIDER_URL=https://sepolia-rollup.arbitrum.io/rpc
FRAMINO_NFT_CONTRACT_ADDRESS=0x...

# Wallet Configuration
CONTRACT_OWNER_PRIVATE_KEY=0x...
SENDER_PRIVATE_KEY=0x...

# Token Addresses
USDC_ADDRESS=0x...

# Paymaster Configuration
PAYMASTER_V08_ADDRESS=0x...
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd framino-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Development

### Start development server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot reload enabled.

### Build for production
```bash
npm run build
```
This will:
1. Generate TSOA routes and OpenAPI specification
2. Compile TypeScript to JavaScript in the `dist/` directory

### Start production server
```bash
npm start
```

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` to access the interactive Swagger UI documentation.

## Smart Contract

The project includes a Solidity smart contract (`src/contract/framino.sol`) implementing:
- ERC-1155 multi-token standard
- Custom URI management
- Redeemable balance system
- Completion tracking for pilgrimage journeys
- Owner-controlled operations

## Architecture Highlights

### Controller Layer
- Uses TSOA decorators for automatic route generation
- Type-safe request/response handling
- Automatic OpenAPI documentation generation

### Service Layer
- Encapsulates business logic and blockchain interactions
- Handles both Ethers.js and Viem for different use cases
- Implements gasless transactions with Account Abstraction

### Model Layer
- TypeScript interfaces for type safety
- Clear separation of concerns
- Comprehensive data validation

## Network

Currently configured for **Arbitrum Sepolia Testnet**:
- Fast and cheap transactions
- EIP-7702 and Account Abstraction support
- USDC testnet token integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
