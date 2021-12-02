import { Injectable } from "@nestjs/common";
import { UsersService } from "../user/user.service";

@Injectable()
export class AudioService {
    constructor(private userService: UsersService) {}
}