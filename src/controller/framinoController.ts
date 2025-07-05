import {
    Body,
    Controller,
    Post,
    Route,
    Tags,
} from "tsoa";
import dotenv from "dotenv";
import { FraminoService } from "../service/framinoService";
import { DonateRequest } from "../model/framinoModel";
dotenv.config();

const framinoService = new FraminoService

@Tags("Framino")
@Route("framino")
export class UserController extends Controller {    
    // @Get("")
    // public async getNft(): Promise<Nft[]> {
    //     const result = await framinoService.getNft();
    //     return result;
    // }

    @Post("donate")
    public async donateUSDC(@Body() body: DonateRequest): Promise<{ txHash: string }> {
        const result = framinoService.donateUSDCService(body);
        return result;
    }

}