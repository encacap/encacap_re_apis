import { ContactEntity } from 'src/modules/contact/entities/contact.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IWebsite } from '../constants/website.interface';

@Entity({ name: 'websites' })
export class WebsiteEntity implements IWebsite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  description: string;

  @OneToMany(() => UserEntity, (user) => user.website)
  users: UserEntity[];

  @OneToMany(() => ContactEntity, (contact) => contact.website)
  contacts: ContactEntity[];
}
