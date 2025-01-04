import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';

import { LoginDTO } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';
import { ReturnLoginDTO } from '../dto/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async login(@Body() loginDTO: LoginDTO): Promise<ReturnLoginDTO> {
    return this.authService.login(loginDTO);
  }
}
