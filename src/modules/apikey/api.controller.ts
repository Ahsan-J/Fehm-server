import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";
import { AuthUser } from "../auth/auth.decorator";
import { UseRoles } from "../auth/auth.guard";
import { User } from "../user/user.entity";
import { UserRole } from "../user/user.enum";
import { CreateAccessKey, UpdateAccessKey } from "./api.dto";
import { API } from "./api.entity";
import { ApiService } from './api.service';

@ApiTags('Access Point')
@Controller('accesspoint')
@UseRoles(UserRole.SuperAdmin)
export class ApiController {
    constructor(
        private apiService: ApiService,
    ) {}
    
    @Post()
    async createAPIKey(@Body() body: CreateAccessKey, @AuthUser() user: User): Promise<API> {
        return await this.apiService.createApiKey(body, user);
    }

    @Get()
    async getAllApiKeys(@Query() query: PaginationQuery): Promise<Array<API> | { meta: PaginationMeta }> {
        const page = parseInt(query.page) || 1
        const pageSize = parseInt(query.pageSize) || 10;

        const [data, meta] = await this.apiService.getAllApiKeys({
            skip: (page - 1) * pageSize,
            take: page * pageSize
        });

        return {
            ...data,
            meta
        }
    }

    @Get(':id')
    async getApiKey(@Param('id') id): Promise<API> {
        return await this.apiService.getApiKey(id)
    }

    @Delete(':id')
    async deleteApiKey(@Param('id') id): Promise<boolean> {
        return await this.apiService.deleteApiKey(id)
    }

    @Put(':id')
    async updateApiKey(@Param('id') id, @Body() body: UpdateAccessKey): Promise<API> {
        return await this.apiService.updateApiKey(id, {...body});
    }
}