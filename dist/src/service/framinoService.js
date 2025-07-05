"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraminoService = void 0;
const framinoModel_1 = require("../model/framinoModel");
require("dotenv/config");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const accounts_1 = require("viem/accounts");
const account_abstraction_1 = require("viem/account-abstraction");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const permitService_1 = require("../service/permitService");
const viem_2 = require("viem");
/**
 * FraminoService provides methods to interact with NFTs and perform USDC donations.
 */
// Note: This service is designed to work with the Sepolia testnet.
class FraminoService {
    async getNft() {
        // mock data
        return [
            new framinoModel_1.Nft({
                contractAddress: "0x1234567890abcdef",
                tokenId: "1",
                owner: "0xabcdef1234567890",
                amount: "1",
                metadata: { name: "NFT #1", description: "A sample NFT" }
            })
        ];
    }
    async donateUSDCService(body) {
        // 1. Load environment variables and parameters
        const chain = chains_1.arbitrumSepolia; // Use Sepolia testnet
        const usdcAddress = process.env.USDC_ADDRESS;
        const paymasterAddress = process.env.PAYMASTER_V08_ADDRESS;
        const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
        // 2. Create viem clients
        const client = (0, viem_1.createPublicClient)({ chain, transport: (0, viem_1.http)() });
        const owner = (0, accounts_1.privateKeyToAccount)(ownerPrivateKey);
        // 3. Get the smart account (EIP-7702)
        const account = await (0, account_abstraction_1.toSimple7702SmartAccount)({ client, owner });
        // 4. Get USDC contract
        const usdc = (0, viem_1.getContract)({ client, address: usdcAddress, abi: viem_1.erc20Abi });
        // 5. Check USDC balance
        const usdcBalance = await usdc.read.balanceOf([account.address]);
        const amount = BigInt(Math.floor(Number(body.amount) * 1e6)); // USDC uses 6 decimals
        if (usdcBalance < amount) {
            throw new Error(`Insufficient USDC balance. Please fund ${account.address}`);
        }
        // 6. Sign permit
        const paymaster = {
            async getPaymasterData(parameters) {
                const permitAmount = (0, viem_2.hexToBigInt)('0x100000000');
                const permitSignature = await (0, permitService_1.signPermit)({
                    tokenAddress: usdcAddress,
                    account,
                    client,
                    spenderAddress: paymasterAddress,
                    permitAmount: permitAmount,
                });
                const paymasterData = (0, viem_1.encodePacked)(["uint8", "address", "uint256", "bytes"], [0, usdcAddress, permitAmount, permitSignature]);
                return {
                    paymaster: paymasterAddress,
                    paymasterData,
                    paymasterVerificationGasLimit: (0, viem_2.hexToBigInt)('0x200000'),
                    paymasterPostOpGasLimit: (0, viem_2.hexToBigInt)('0x15000'),
                    isFinal: true,
                };
            },
        };
        // 7. Encode paymasterData
        const bundlerClient = (0, account_abstraction_1.createBundlerClient)({
            account,
            client,
            paymaster,
            userOperation: {
                estimateFeesPerGas: async ({ account, bundlerClient, userOperation }) => {
                    const fees = await bundlerClient.request({
                        method: "pimlico_getUserOperationGasPrice",
                    });
                    if (typeof fees === "object" &&
                        fees !== null &&
                        "standard" in fees &&
                        typeof fees.standard === "object") {
                        const maxFeePerGas = (0, viem_2.hexToBigInt)(fees.standard.maxFeePerGas);
                        const maxPriorityFeePerGas = (0, viem_2.hexToBigInt)(fees.standard.maxPriorityFeePerGas);
                        return { maxFeePerGas, maxPriorityFeePerGas };
                    }
                    else {
                        throw new Error("Unexpected response from pimlico_getUserOperationGasPrice: " + JSON.stringify(fees));
                    }
                },
            },
            transport: (0, viem_1.http)(`https://public.pimlico.io/v2/${client.chain.id}/rpc`),
        });
        const recipientAddress = process.env.RECIPIENT_ADDRESS;
        if (!recipientAddress) {
            throw new Error("RECIPIENT_ADDRESS environment variable is not set");
        }
        // 8. Sign authorization for 7702 account
        const authorization = await owner.signAuthorization({
            chainId: chain.id,
            nonce: await client.getTransactionCount({ address: owner.address }),
            contractAddress: account.authorization.address,
        });
        const hash = await bundlerClient.sendUserOperation({
            account,
            calls: [
                {
                    to: usdc.address,
                    abi: usdc.abi,
                    functionName: "transfer",
                    args: [recipientAddress, amount],
                },
            ],
            authorization: authorization,
        });
        console.log("UserOperation hash", hash);
        const receipt = await bundlerClient.waitForUserOperationReceipt({ hash });
        console.log("Transaction hash", receipt.receipt.transactionHash);
        return { txHash: receipt.receipt.transactionHash };
    }
}
exports.FraminoService = FraminoService;
