import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CloudflareVariantNotExistsValidator } from '../validators/cloudflare-variant-not-exists.validator';

export class RootUpdateCloudflareVariantParamDto {
  @IsString()
  @IsNotEmpty()
  @Validate(CloudflareVariantNotExistsValidator)
  id: string;
}
