import { ReturnUserDTO } from './../../user/dtos/returnUser.dto';

export interface ReturnLoginDTO {
  user: ReturnUserDTO;
  accessToken: string;
}
