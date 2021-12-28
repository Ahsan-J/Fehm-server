import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccessKey } from './api.dto';
import { API } from './api.entity';
import { nanoid } from "nanoid";
import moment from 'moment';
import { User } from '../user/user.entity';
import { APIAccessLevel, APIStatus, API_EXPIRY } from './api.enum';
import { CommonService } from 'src/helper-modules/common/common.service';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(API)
    private apiRepository: Repository<API>,
    private configService: ConfigService,
    private commonService: CommonService,
  ) {}

  async createApiKey(keyInfo : CreateAccessKey, creator: User): Promise<API> {

    return await this.apiRepository.save({
      key: nanoid(),
      app_id: this.configService.get('APP_ID'),
      name: keyInfo.name,
      description: keyInfo.description,
      access_level: APIAccessLevel.Standard,
      created_by: creator,
      expiry_at: moment().add(API_EXPIRY,"months").toISOString(),
      created_at: moment().toISOString(),
      updated_at: moment().toISOString(),
      deleted_at: null,
      status: APIStatus.Active,
    });
  }
  
  async getAllApiKeys(): Promise<Array<API>> {
    return await this.apiRepository.find();
  }

  async getApiKey(key: API['key']): Promise<API> {
    if (!key) throw new BadRequestException("Invalid Key");

    const apiKey = await this.apiRepository.findOne(key, {relations: ['created_by']})
    
    if (!apiKey) throw new NotFoundException("No API Key found")
    
    return apiKey;
  }

  async deleteApiKey(key: API['key']): Promise<boolean>{
    const apiKey = await this.getApiKey(key);
    apiKey.deleted_at = moment().toISOString();
    apiKey.status = APIStatus.InActive;
    await this.apiRepository.save(apiKey);
    return true;
  }

  async updateApiKey(key: API['key'], updateKey: {[key in keyof API]?: any}): Promise<API> {
    const apiKey = await this.getApiKey(key);
    Object.assign(apiKey, {
      updated_at: moment().toISOString(),
      name: updateKey.name || apiKey.name,
      expiry_at: updateKey.expiry_at || apiKey.expiry_at,
      description: updateKey.description || apiKey.description,
      status: this.commonService.setValue(apiKey.status, updateKey.status),
      access_level: updateKey.access_level || apiKey.access_level,
    })
    return await this.apiRepository.save(apiKey)
  }

  async validateApiKeyAccess(key: API['key'], access: API['access_level']): Promise<boolean> {
    const apiKey = await this.getApiKey(key);
    return (
      this.commonService.checkValue(apiKey.access_level, access) && 
      apiKey.app_id == this.configService.get("APP_ID") && 
      moment(apiKey.expiry_at).isAfter(moment()) &&
      this.commonService.checkValue(apiKey.status, APIStatus.Active)
    )
  }
}