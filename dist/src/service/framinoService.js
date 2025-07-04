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
exports.FraminoService = void 0;
const framinoModel_1 = require("../model/framinoModel");
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
}
exports.FraminoService = FraminoService;
