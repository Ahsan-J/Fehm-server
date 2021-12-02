import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccessKeyBody } from "./api.dto";
import { API } from "./api.entity";
import { ApiService } from './api.service';

@ApiTags('Access Point')
@Controller('accesspoint')
export class ApiController {
    constructor(
        private apiService: ApiService,
    ) {}
    
    @Post()
    async createAPIKey(@Body() body: AccessKeyBody): Promise<API> {
        // Validate the key presence
        return await this.apiService.createApiKey(body)
    }

    @Get()
    async getAllApiKeys(): Promise<Array<API>> {
        return await this.apiService.getAllApiKeys()
    }

    @Get(':id')
    async getApiKey(@Param('id') id): Promise<API> {
        return await this.apiService.getApiKey(id)
    }
}