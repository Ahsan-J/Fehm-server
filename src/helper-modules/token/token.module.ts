import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApiModule } from "src/modules/apikey/api.module";
import { AuthModule } from "src/modules/auth/auth.module";
import { RedisModule } from "../cache/cache.module";
import { CommonModule } from "../common/common.module";
import { TokenService } from "./token.service";

@Global()
@Module({
    imports:[
        ConfigModule,
        CommonModule,
        AuthModule,
        ApiModule,
        RedisModule,
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}