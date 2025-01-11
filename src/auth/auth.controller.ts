import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ReturnLoginDTO } from './dto/returnLogin.dto';
import { LoginDTO } from './dto/login.dto';
import { ReturnUserDTO } from 'src/user/dtos/returnUser.dto';

class ReturnLoginResponse {
  user: ReturnUserDTO;
  accessToken: string;
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: ReturnLoginResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Body() loginDTO: LoginDTO): Promise<ReturnLoginDTO> {
    return this.authService.login(loginDTO);
  }
}
