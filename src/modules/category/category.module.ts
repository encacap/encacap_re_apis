import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlgoliaProviderModule } from 'src/providers/algolia/algolia.module';
import { CloudflareModule } from '../cloudflare/cloudflare.module';
import { AdminCategoryGroupController } from './controllers/admin-category-group.controller';
import { AdminCategoryController } from './controllers/admin-category.controller';
import { RootCategoryGroupController } from './controllers/root-category-group.controller';
import { CategoryGroupWebsiteEntity } from './entities/category-group-website.entity';
import { CategoryGroupEntity } from './entities/category-group.entity';
import { CategoryEntity } from './entities/category.entity';
import { CategoryGroupService } from './services/category-group.service';
import { CategoryService } from './services/category.service';
import { CategoryCanDeleteValidator } from './validators/category-can-delete.validator';
import { CategoryCanModifyValidator } from './validators/category-can-modify.validator';
import { CategoryExistsValidator } from './validators/category-exists.validator';

@Module({
  imports: [
    AlgoliaProviderModule,
    TypeOrmModule.forFeature([CategoryGroupEntity, CategoryGroupWebsiteEntity, CategoryEntity]),
    CloudflareModule,
  ],
  controllers: [RootCategoryGroupController, AdminCategoryGroupController, AdminCategoryController],
  providers: [
    CategoryGroupService,
    CategoryService,
    CategoryExistsValidator,
    CategoryCanModifyValidator,
    CategoryCanDeleteValidator,
  ],
})
export class CategoryModule {}
