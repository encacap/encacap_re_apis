import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AddUserIdToParam } from 'src/common/decorators/add-user-id-to-param.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactBodyDto } from '../dto/update-contact-body.dto';
import { UpdateContactParamDto } from '../dto/update-contact-param.dto';
import { ContactService } from '../services/contact.service';

@Controller('admin/contacts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll(@Req() { user }) {
    return this.contactService.findAll({ websiteId: user.website.id });
  }

  @Post()
  create(@Body() createContactDto: CreateContactDto, @Req() { user }) {
    return this.contactService.create(createContactDto, user);
  }

  @Patch(':id')
  update(
    @AddUserIdToParam() @Param() { id }: UpdateContactParamDto,
    @Body() updateContactDto: UpdateContactBodyDto,
  ) {
    return this.contactService.update(id, updateContactDto);
  }
}
