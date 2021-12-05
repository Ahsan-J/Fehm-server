import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
}