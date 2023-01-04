import { HttpService } from '@nestjs/axios';
// import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Queue } from 'bull';
import FormData from 'form-data';
import { get, set } from 'lodash';
import { LoggerService } from 'src/common/modules/logger/logger.service';
import { randomStringPrefix } from 'src/common/utils/helpers.util';
import { CloudflareConfigService } from 'src/configs/cloudflare/cloudflare-config.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CLOUDFLARE_IMAGE_STATUS_ENUM } from '../constants/cloudflare-image-status.constant';
import { CloudflareImageEntity } from '../entities/cloudflare-image.entity';
import { CloudflareVariantService } from './cloudflare-variant.service';

@Injectable()
export class CloudflareImageService {
  private logger = new LoggerService('CloudflareImageService');
  private imageURL: string;

  constructor(
    @InjectRepository(CloudflareImageEntity)
    private readonly cloudflareImageRepository: Repository<CloudflareImageEntity>,
    private readonly httpService: HttpService,
    // @InjectQueue('cloudflare-image')
    // private readonly cloudflareImageQueue: Queue,
    private readonly cloudflareConfigService: CloudflareConfigService,
    private readonly cloudflareVariantService: CloudflareVariantService,
  ) {
    this.imageURL = this.cloudflareConfigService.images.delivery;
  }

  async uploadSingle(file: Express.Multer.File, user: UserEntity) {
    const imageId = randomStringPrefix();

    const record = await this.cloudflareImageRepository.save({
      id: imageId,
      status: CLOUDFLARE_IMAGE_STATUS_ENUM.PROCESSING,
      size: file.size,
      extension: file.mimetype,
      websiteId: user.websiteId,
    });

    await this.uploadToCloudflare(imageId, file.mimetype, file.buffer);

    return record;
  }

  uploadMultiple(files: Express.Multer.File[], user: UserEntity) {
    const task = [];

    for (const file of files) {
      task.push(this.uploadSingle(file, user));
    }

    return Promise.all(task);
  }

  async uploadToCloudflare(imageId: string, mimetype: string, buffer: Buffer) {
    const formData = new FormData();

    formData.append('file', Buffer.from(buffer), {
      filename: this.getFileName(imageId, mimetype),
      contentType: mimetype,
    });

    formData.append('id', imageId);

    try {
      await this.httpService.axiosRef.post('', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await this.cloudflareImageRepository.save({
        id: imageId,
        status: CLOUDFLARE_IMAGE_STATUS_ENUM.READY,
      });
    } catch (error) {
      this.logger.error(error);
      await this.cloudflareImageRepository.save({
        id: imageId,
        status: CLOUDFLARE_IMAGE_STATUS_ENUM.PROCESSING_ERROR,
      });
    }
  }

  getOne(imageId: string) {
    return this.cloudflareImageRepository.findOne({
      where: { id: imageId },
    });
  }

  async mapVariantToImage<T>(object: T, imagePath: string) {
    if (Array.isArray(object)) {
      return Promise.all(object.map((item) => this.mapVariantToImage(item, imagePath)));
    }

    const image = get(object, imagePath);

    if (!image || typeof object !== 'object') {
      return object;
    }

    return set(object, imagePath, await this.transformImageToURL(image));
  }

  async mapVariantToImages<T>(object: T, imagePath: string) {
    if (Array.isArray(object)) {
      return Promise.all(object.map((item) => this.mapVariantToImages(item, imagePath)));
    }

    const images = get(object, imagePath);

    if (!images || typeof object !== 'object') {
      return object;
    }

    return set(object, imagePath, await Promise.all(images.map((image) => this.transformImageToURL(image))));
  }

  private async transformImageToURL(image: CloudflareImageEntity) {
    const { id, websiteId } = image;

    const imageVariants = await this.cloudflareVariantService.getAll({
      websiteId,
    });

    const newVariants = imageVariants.reduce((acc, variant) => {
      return {
        ...acc,
        [variant.code]: `${this.imageURL}/${id}/${variant.code}`,
      };
    }, {});

    return newVariants;
  }

  private getFileName(id: string, mimetype: string) {
    return `ENCACAP_RE_${id}.${mimetype.split('/')[1]}`;
  }
}
