import { Injectable } from "@nestjs/common";
import { UsersService } from "../user/user.service";

@Injectable()
export class BookService {
    constructor(private userService: UsersService) {}
}