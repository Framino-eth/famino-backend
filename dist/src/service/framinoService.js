"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getNft() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    donateUSDCService(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Load environment variables and parameters
            const chain = chains_1.sepolia; // Use Sepolia testnet
            const usdcAddress = process.env.USDC_ADDRESS;
            const paymasterAddress = process.env.PAYMASTER_V08_ADDRESS;
            const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
            const amount = BigInt(Math.floor(Number(body.amount) * 1e6)); // USDC uses 6 decimals
            // 2. Create viem clients
            const client = (0, viem_1.createPublicClient)({ chain, transport: (0, viem_1.http)() });
            const owner = (0, accounts_1.privateKeyToAccount)(ownerPrivateKey);
            // 3. Get the smart account (EIP-7702)
            // If you use a custom smart account, adjust accordingly
            // @ts-ignore
            const { toSimple7702SmartAccount } = yield Promise.resolve().then(() => __importStar(require("viem/account-abstraction")));
            const account = yield toSimple7702SmartAccount({ client, owner });
            // 4. Get USDC contract
            const usdc = (0, viem_1.getContract)({ client, address: usdcAddress, abi: viem_1.erc20Abi });
            // 5. Check USDC balance
            const usdcBalance = yield usdc.read.balanceOf([account.address]);
            if (usdcBalance < amount) {
                throw new Error(`Insufficient USDC balance. Please fund ${account.address}`);
            }
            // 6. Sign permit
            const paymaster = {
                getPaymasterData(parameters) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const permitAmount = BigInt(10000000);
                        const permitSignature = yield (0, permitService_1.signPermit)({
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
                            paymasterVerificationGasLimit: BigInt(200000),
                            paymasterPostOpGasLimit: BigInt(15000),
                            isFinal: true,
                        };
                    });
                },
            };
            // 7. Encode paymasterData
            const bundlerClient = (0, account_abstraction_1.createBundlerClient)({
                account,
                client,
                paymaster,
                userOperation: {
                    estimateFeesPerGas: (_a) => __awaiter(this, [_a], void 0, function* ({ account, bundlerClient, userOperation }) {
                        const fees = yield bundlerClient.request({
                            method: "pimlico_getUserOperationGasPrice",
                        });
                        const maxFeePerGas = (0, viem_2.hexToBigInt)(fees.maxFeePerGas);
                        const maxPriorityFeePerGas = (0, viem_2.hexToBigInt)(fees.maxPriorityFeePerGas);
                        return { maxFeePerGas, maxPriorityFeePerGas };
                    }),
                },
                transport: (0, viem_1.http)(`https://public.pimlico.io/v2/${client.chain.id}/rpc`),
            });
            const recipientAddress = process.env.RECIPIENT_ADDRESS;
            if (!recipientAddress) {
                throw new Error("RECIPIENT_ADDRESS environment variable is not set");
            }
            // 8. Sign authorization for 7702 account
            const authorization = yield owner.signAuthorization({
                chainId: chain.id,
                nonce: yield client.getTransactionCount({ address: owner.address }),
                contractAddress: account.authorization.address,
            });
            const hash = yield bundlerClient.sendUserOperation({
                account,
                calls: [
                    {
                        to: usdc.address,
                        abi: usdc.abi,
                        functionName: "transfer",
                        args: [recipientAddress, BigInt(10000)],
                    },
                ],
                authorization: authorization,
            });
            console.log("UserOperation hash", hash);
            const receipt = yield bundlerClient.waitForUserOperationReceipt({ hash });
            console.log("Transaction hash", receipt.receipt.transactionHash);
            // We need to manually exit the process, since viem leaves some promises on the
            // event loop for features we're not using.
            // process.exit();
            return { txHash: receipt.receipt.transactionHash };
        });
    }
}
exports.FraminoService = FraminoService;
