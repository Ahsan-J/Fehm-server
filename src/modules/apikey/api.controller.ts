import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthUser } from "../auth/auth.decorator";
import { UseRoles } from "../auth/auth.guard";
import { User } from "../user/user.entity";
import { UserRole } from "../user/user.enum";
import { CreateAccessKey, UpdateAccessKey } from "./api.dto";
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
    async createAPIKey(@Body() body: CreateAccessKey, @AuthUser() user: User): Promise<API> {
        return await this.apiService.createApiKey(body, user);
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

    @Delete(':id')
    @UseRoles(UserRole.SuperAdmin)
    async deleteApiKey(@Param('id') id): Promise<boolean> {
        return await this.apiService.deleteApiKey(id)
    }

    @Put(':id')
    @UseRoles(UserRole.SuperAdmin)
    async updateApiKey(@Param('id') id, @Body() body: UpdateAccessKey): Promise<API> {
        return await this.apiService.updateApiKey(id, {...body});
    }
}