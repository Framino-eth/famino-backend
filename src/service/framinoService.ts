import { Nft } from "../model/framinoModel";

import "dotenv/config";
import { erc20Abi, encodePacked, http, getContract, createPublicClient } from "viem";
import { arbitrumSepolia, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createBundlerClient, toSimple7702SmartAccount } from "viem/account-abstraction";

import dotenv from "dotenv";
dotenv.config();
import { signPermit } from "../service/permitService";
import { hexToBigInt } from "viem";
import { DonateRequest } from "../model/framinoModel";

/**
 * FraminoService provides methods to interact with NFTs and perform USDC donations.
 */
// Note: This service is designed to work with the Sepolia testnet.
export class FraminoService {
  public async getNft(): Promise<Nft[]> {
    // mock data
    return [
      new Nft({
        contractAddress: "0x1234567890abcdef",
        tokenId: "1",
        owner: "0xabcdef1234567890",
        amount: "1",
        metadata: { name: "NFT #1", description: "A sample NFT" }
      })
    ];
  }

  public async donateUSDCService(body: DonateRequest): Promise<{ txHash: string }> {
    // 1. Load environment variables and parameters
    const chain = arbitrumSepolia; // Use Sepolia testnet
    const usdcAddress = process.env.USDC_ADDRESS as `0x${string}`;
    const paymasterAddress = process.env.PAYMASTER_V08_ADDRESS as `0x${string}`;
    const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY as `0x${string}`;

    // 2. Create viem clients
    const client = createPublicClient({ chain, transport: http() });
    const owner = privateKeyToAccount(ownerPrivateKey);

    // 3. Get the smart account (EIP-7702)
    const account = await toSimple7702SmartAccount({ client, owner });

    // 4. Get USDC contract
    const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi });

    // 5. Check USDC balance
    const usdcBalance = await usdc.read.balanceOf([account.address]);
    const amount = BigInt(Math.floor(Number(body.amount) * 1e6)); // USDC uses 6 decimals

    if (usdcBalance < amount) {
        throw new Error(`Insufficient USDC balance. Please fund ${account.address}`);
    }

    // 6. Sign permit
    const paymaster = {
        async getPaymasterData(parameters: any) {
            const permitAmount = hexToBigInt('0x100000000');
            const permitSignature = await signPermit({
            tokenAddress: usdcAddress,
            account,
            client,
            spenderAddress: paymasterAddress,
            permitAmount: permitAmount,
            });

            const paymasterData = encodePacked(
            ["uint8", "address", "uint256", "bytes"],
            [0, usdcAddress, permitAmount, permitSignature],
            );

            return {
            paymaster: paymasterAddress,
            paymasterData,
            paymasterVerificationGasLimit: hexToBigInt('0x200000'),
            paymasterPostOpGasLimit: hexToBigInt('0x15000'),
            isFinal: true,
            };
        },
    };

    // 7. Encode paymasterData
    const bundlerClient = createBundlerClient({
        account,
        client,
        paymaster,
        userOperation: {
            estimateFeesPerGas: async ({ account, bundlerClient, userOperation }) => {
            const fees = await bundlerClient.request({
                method: "pimlico_getUserOperationGasPrice" as any,
            });
            if (
                typeof fees === "object" &&
                fees !== null &&
                "standard" in fees &&
                typeof (fees as any).standard === "object"
            ) {
                const maxFeePerGas = hexToBigInt((fees as any).standard.maxFeePerGas);
                const maxPriorityFeePerGas = hexToBigInt((fees as any).standard.maxPriorityFeePerGas);

                return { maxFeePerGas, maxPriorityFeePerGas };
            } else {
                throw new Error("Unexpected response from pimlico_getUserOperationGasPrice: " + JSON.stringify(fees));
            }
            },
        },
        transport: http(`https://public.pimlico.io/v2/${client.chain.id}/rpc`),
    });
    
    const recipientAddress = process.env.RECIPIENT_ADDRESS as `0x${string}`;
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