import { API } from "src/modules/apikey/api.entity";
import { User } from "src/modules/user/user.entity";

export interface ITokenData {
    tokenId: string;
    appId: string;
    userId: User['id'],
    userRole: User['role'],
    apiKey: API['key'],
    apiAccess: API['access_level'],
    deviceType: string,
    browser: string,
    tokenTime: string,
}