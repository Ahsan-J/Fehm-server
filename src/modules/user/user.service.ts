import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(CommonService)
    private commonService: CommonService
  ) {}
  
  async getUser(id: User['id']): Promise<User> {
    if(!id) {
      throw new BadRequestException(`User's "id" is not definded`)
    }
    const user = await this.usersRepository.findOne(id);

    if(!user) {
      throw new NotFoundException(`No User found for the id ${id}`)
    }

    return user;
  }

  async createUser(userInfo : RegisterBody): Promise<User> {
    const user = await this.usersRepository.create({
      password: this.getPasswordHash(userInfo.password),
      email: userInfo.email,
      contact_number: userInfo.contact_number,
      id: nanoid(),
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
      deleted_at: null,
      status: UserStatus.InActive,
    })
    this.usersRepository.insert(user);
    return user;
  }

  async updateUser(userInfo: User): Promise<User> {
    return this.usersRepository.save(userInfo)
  }

  getPasswordHash(password: User['password']):string {
    return createHmac('sha256', this.configService.get("APP_ID"))
    .update(password)
    .digest('hex');
  }

  async getUserByEmail(email: User['email']): Promise<User> {
    if(!email) {
      throw new BadRequestException(`User's "email" is not definded`)
    }

    const user =  await this.usersRepository.findOne({
      where: { email },
    });

    if(!user) {
      throw new NotFoundException(`No User found for the email ${email}`)
    }

    return user;
  }

  async getUsers(): Promise<Array<User>> {
    return await this.usersRepository.find();
  }
}