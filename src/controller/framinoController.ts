import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Route,
    Security,
    Tags,
} from "tsoa";
import { Nft, NftMetadata } from "../model/framinoModel";
import { FraminoService } from "../service/framinoService";

const framinoService = new FraminoService

@Route("nft")
@Tags("NFT")
export class UserController extends Controller {    
    @Get("")
    public async getNft(): Promise<Nft[]> {
        const result = await framinoService.getNft();
        return result;
    }
}