"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eip2612Abi = void 0;
exports.eip2612Permit = eip2612Permit;
exports.signPermit = signPermit;
const viem_1 = require("viem");
// Adapted from https://github.com/vacekj/wagmi-permit/blob/main/src/permit.ts
function eip2612Permit(_a) {
    return __awaiter(this, arguments, void 0, function* ({ token, chain, ownerAddress, spenderAddress, value, }) {
        return {
            types: {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            },
            primaryType: "Permit",
            domain: {
                name: yield token.read.name(),
                version: yield token.read.version(),
                chainId: chain.id,
                verifyingContract: token.address,
            },
            message: {
                owner: ownerAddress,
                spender: spenderAddress,
                value,
                nonce: yield token.read.nonces([ownerAddress]),
                // The paymaster cannot access block.timestamp due to 4337 opcode
                // restrictions, so the deadline must be MAX_UINT256.
                deadline: viem_1.maxUint256,
            },
        };
    });
}
exports.eip2612Abi = [
    ...viem_1.erc20Abi,
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        name: "nonces",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
];
function signPermit(_a) {
    return __awaiter(this, arguments, void 0, function* ({ tokenAddress, client, account, spenderAddress, permitAmount, }) {
        const token = (0, viem_1.getContract)({
            client,
            address: tokenAddress,
            abi: exports.eip2612Abi,
        });
        const permitData = yield eip2612Permit({
            token,
            chain: client.chain,
            ownerAddress: account.address,
            spenderAddress,
            value: permitAmount,
        });
        const wrappedPermitSignature = yield account.signTypedData(permitData);
        const isValid = yield client.verifyTypedData(Object.assign(Object.assign({}, permitData), { address: account.address, signature: wrappedPermitSignature }));
        if (!isValid) {
            throw new Error(`Invalid permit signature for ${account.address}: ${wrappedPermitSignature}`);
        }
        const { signature } = (0, viem_1.parseErc6492Signature)(wrappedPermitSignature);
        return signature;
    });
}
