import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKeyBody } from './api.dto';
import { API } from './api.entity';
import { nanoid } from "nanoid";
import moment from 'moment';
import { UsersService } from '../user/user.service';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(API)
    private apiRepository: Repository<API>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  KeyExpiryTime = 12 // Months

  async createApiKey(keyInfo : AccessKeyBody): Promise<API> {

    const creator = await this.userService.getUser(keyInfo.user_id);

    return await this.apiRepository.save({
      key: nanoid(),
      app_id: this.configService.get('APP_ID'),
      name: keyInfo.name,
      description: keyInfo.description,
      access_level: keyInfo.access_level,
      created_by: creator,
      expiry_at: moment().add(this.KeyExpiryTime,"months").toISOString(),
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
      deleted_at: null,
      status: 1
    });
  }
  
  async getAllApiKeys(): Promise<Array<API>> {
    return await this.apiRepository.find();
  }


  async getApiKey(id:string): Promise<API> {
    if (!id) throw new BadRequestException("Invalid id");

    const apiKey = await this.apiRepository.findOne(id)
    
    if (!apiKey) throw new BadRequestException("No API Key found for the id")
    
    return apiKey;
  }

}