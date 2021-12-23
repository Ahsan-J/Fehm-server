import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UseRoles } from "../auth/auth.guard";
import { UserRole } from "../user/user.enum";
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
    @UseRoles(UserRole.SuperAdmin)
    async createAPIKey(@Body() body: AccessKeyBody): Promise<API> {
        // Validate the key presence
        return await this.apiService.createApiKey(body)
    }

    @Get()
    @UseRoles(UserRole.SuperAdmin)
    async getAllApiKeys(): Promise<Array<API>> {
        return await this.apiService.getAllApiKeys()
    }

    @Get(':id')
    @UseRoles(UserRole.SuperAdmin, UserRole.Admin)
    async getApiKey(@Param('id') id): Promise<API> {
        return await this.apiService.getApiKey(id)
    }
}