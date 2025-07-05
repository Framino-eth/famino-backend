import {
    Body,
    Controller,
    Get,
    Post,
    Route,
    Tags,
} from "tsoa";
import { FraminoService } from "../service/framinoService";
import { DonateRequest, GetContractInfoResponseModel, NftMarkCompletedRequest } from "../model/framinoModel";
import { NftMintRequest } from "../model/framinoModel";

@Tags("Framino")
@Route("framino")
export class FraminoController extends Controller {    

    private framinoService = new FraminoService()

    @Post("donate-USDC-with-paymaster")
    public async donateUSDCWithPaymaster(
        @Body() requestBody: DonateRequest
        ): Promise<{ txHash: string }> {
        const result = await this.framinoService.donateUSDCWithPaymasterService(requestBody);
        return result;
    }

    @Post("mint-with-paymaster")
    public async mintNftByWithPaymaster(
        @Body() requestBody: NftMintRequest
    ): Promise<{ txHash: string }> {
        const result = await this.framinoService.mintNftWithPaymasterService(requestBody);
        return result;
    }

    @Post("mark-completed-with-paymaster")
    public async markCompleted(
        @Body() requestBody: NftMarkCompletedRequest
    ): Promise<{ txHash: string }> {
        const result = await this.framinoService.markCompletedWithPaymasterService(requestBody);
        return result;
    }

    @Get("contract")
    public async getContractInfo(): Promise<GetContractInfoResponseModel> {
        const result = await this.framinoService.getContractInfoService();
        return result;
    }
}
