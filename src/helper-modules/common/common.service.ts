import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaginationMeta } from "./common.dto";

@Injectable()
export class CommonService {
    constructor(private configService: ConfigService) {}

    setValue(value: number, status: number): number {
        return value | status
    }

    checkValue(value: number, status: number): boolean {
        return (value & status) == status;
    }

    removeValue(value: number, status: number): number {
        return value & ~status
    }

    generateMeta(count, skip, take): PaginationMeta {
        const page_size = take - skip;
        return {
            from: skip,
            to: take,
            total: count,
            current_page: take / page_size,
            last_page: Math.ceil(count / page_size),
            page_size,
        }
    }
}