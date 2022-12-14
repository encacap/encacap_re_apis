import { IRole } from 'src/modules/user/interfaces/user.interface';
import { IWebsite } from 'src/modules/website/constants/website.interface';

export interface IJwtPayload {
  id: number;
  email: string;
  roles: IRole[];
  website: IWebsite;
}
