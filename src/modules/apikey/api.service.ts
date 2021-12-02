import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKeyBody } from './api.dto';
import { API } from './api.entity';
import { nanoid } from "nanoid";
import moment from 'moment';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(API)
    private apiRepository: Repository<API>,
    private configService: ConfigService,
  ) {}

  KeyExpiryTime = 12 // Months

  async createApiKey(keyInfo : AccessKeyBody): Promise<API> {

    const apiKey = await this.apiRepository.create({
      key: nanoid(),
      app_id: this.configService.get('APP_ID'),
      name: keyInfo.name,
      description: keyInfo.description,
      access_level: keyInfo.access_level,
      created_by: keyInfo.user_id,
      expiry_at: moment().add(this.KeyExpiryTime,"months").toISOString(),
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
      deleted_at: null,
      status: 1
    })

    this.apiRepository.insert(apiKey);
    return apiKey;
  }

  async getAllApiKeys(): Promise<Array<API>> {
    return await this.apiRepository.find();
  }

  async getApiKey(id:string): Promise<API> {
    return await this.apiRepository.findOne(id);
  }

}