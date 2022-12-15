import { IsOptional, IsString } from 'class-validator';
import { BaseLocationListQueryDto } from './base-location-list-query.dto';

export class DistrictWebsiteListQueryDto extends BaseLocationListQueryDto {
  @IsOptional()
  @IsString()
  provinceCode?: string;
}