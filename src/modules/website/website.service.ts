import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WebsiteEntity } from './entities/website.entity';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(WebsiteEntity) private readonly websiteRepository: Repository<WebsiteEntity>,
  ) {}

  findOne(query: FindOptionsWhere<WebsiteEntity>) {
    return this.websiteRepository.findOneBy(query);
  }
}
