import { WebsiteEntity } from 'src/modules/website/entities/website.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CloudflareVariantEntity } from './cloudflare-variant.entity';

@Entity({ name: 'cloudflare_variant_websites' })
export class CloudflareVariantWebsiteEntity {
  @PrimaryColumn({ name: 'variant_code' })
  variantCode: string;

  @PrimaryColumn({ name: 'website_id' })
  websiteId: number;

  @ManyToOne(() => CloudflareVariantEntity, (variant) => variant.code)
  @JoinColumn({ name: 'variant_code', referencedColumnName: 'code' })
  variant: CloudflareVariantEntity;

  @ManyToOne(() => WebsiteEntity, (website) => website.id)
  @JoinColumn({ name: 'website_id', referencedColumnName: 'id' })
  website: WebsiteEntity;
}
