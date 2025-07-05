"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsoa_1 = require("tsoa");
const framinoService_1 = require("../service/framinoService");
let UserController = class UserController extends tsoa_1.Controller {
    constructor() {
        // @Get("")
        // public async getNft(): Promise<Nft[]> {
        //     const result = await framinoService.getNft();
        //     return result;
        // }
        super(...arguments);
        this.framinoService = new framinoService_1.FraminoService();
    }
    async donateUSDC(requestBody) {
        const result = await this.framinoService.donateUSDCService(requestBody);
        return result;
    }
};
exports.UserController = UserController;
__decorate([
    (0, tsoa_1.Post)("donate"),
    __param(0, (0, tsoa_1.Body)())
], UserController.prototype, "donateUSDC", null);
exports.UserController = UserController = __decorate([
    (0, tsoa_1.Tags)("Framino"),
    (0, tsoa_1.Route)("framino")
], UserController);
