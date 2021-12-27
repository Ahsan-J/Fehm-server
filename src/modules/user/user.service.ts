import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { Repository } from 'typeorm';
import { RegisterBody } from '../auth/auth.dto';
import { User } from './user.entity';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { UserStatus } from './user.enum';
import { CommonService } from 'src/helper-modules/common/common.service';
import { UserGenre } from './user_genre.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserGenre)
    private usersGenre: Repository<UserGenre>,
    private configService: ConfigService,
    @Inject(CommonService)
    private commonService: CommonService
  ) { }

  async getUser(id: User['id']): Promise<User> {
    if (!id) {
      throw new BadRequestException(`User's "id" is not definded`)
    }

    const user = await this.usersRepository.findOne(id, {relations:['genre']});

    if (!user) {
      throw new BadRequestException(`No User found for the id ${id}`)
    }

    return user;
  }

  async createUser(registerBody: RegisterBody): Promise<User> {
    
    if (registerBody.password !== registerBody.confirm_password) {
      throw new ForbiddenException("Password mismatch")
    }

    let savedUser: User;

    try {
      savedUser = await this.getUserByEmail(registerBody.email);
    } catch(e) {
      // console.log(e)
    }
    
    if(savedUser) {
      throw new ForbiddenException("User Already registered with email")
    }

    if(registerBody.confirm_password !== registerBody.password) {
      throw new BadRequestException("User Password mismatch")
    }

    const user = await this.usersRepository.save({
      password: this.getPasswordHash(registerBody.password),
      email: registerBody.email,
      contact_number: registerBody.contact_number,
      id: nanoid(),
      first_name: registerBody.first_name,
      last_name: registerBody.last_name,
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
      deleted_at: null,
      status: UserStatus.InActive,
    });
    
    return user;
  }

  async updateUser(userInfo: User): Promise<User> {
    return this.usersRepository.save(userInfo)
  }

  getPasswordHash(password: User['password']): string {
    return createHmac('sha256', this.configService.get("APP_ID"))
      .update(password)
      .digest('hex');
  }

  async getUserByEmail(email: User['email']): Promise<User> {
    if (!email) {
      throw new BadRequestException(`User's "email" is not definded`)
    }

    const user = await this.usersRepository.findOne({
      where: { email },
      relations :['genre']
    });

    if (!user) {
      throw new NotFoundException(`No User found for the email ${email}`)
    }

    return user;
  }

  async getUsers(): Promise<Array<User>> {
    return await this.usersRepository.find({relations:['genre']});
  }
}