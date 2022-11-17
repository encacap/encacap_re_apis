import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CloudflareImageValidationPipe } from '../pipes/cloudflare-image-validation.pipe';
import { CloudflareImagesValidationPipe } from '../pipes/cloudflare-images-validation.pipe';
import { CloudflareImageService } from '../services/cloudflare-image.service';

@Controller('admin/cloudflare/images')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminCloudflareImageController {
  constructor(private readonly cloudflareImageService: CloudflareImageService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(CloudflareImageValidationPipe)
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() { user }) {
    return this.cloudflareImageService.upload(file, user);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(CloudflareImagesValidationPipe)
  async uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[], @Req() { user }) {
    return this.cloudflareImageService.uploadMultiple(files, user);
  }
}
