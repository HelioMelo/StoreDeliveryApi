import { IsString } from 'class-validator';

export class UpdateStore {
  @IsString()
  store: string;
}
