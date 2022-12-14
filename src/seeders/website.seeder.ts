import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { IWebsite } from 'src/modules/website/constants/website.interface';
import { WebsiteEntity } from 'src/modules/website/entities/website.entity';
import { Repository } from 'typeorm';

export const websiteItems: IWebsite[] = [
  {
    id: 1,
    name: 'Encacap RE',
    url: 'https://www.re.encacap.com',
    description: 'This is the supper root website. It can be used to manage all the websites.',
  },
];

@Injectable()
export class WebsiteSeeder implements Seeder {
  constructor(
    @InjectRepository(WebsiteEntity) private readonly websiteRepository: Repository<WebsiteEntity>,
  ) {}

  async upsertItem(item: IWebsite) {
    const record = await this.websiteRepository.findOneBy({ id: item.id });

    if (record) {
      return this.websiteRepository.update(record.id, item);
    }

    return this.websiteRepository.save(item);
  }

  seed() {
    const seedTasks = websiteItems.map((item) => this.upsertItem(item));
    return Promise.all(seedTasks);
  }

  drop() {
    return this.websiteRepository.delete({});
  }
}
