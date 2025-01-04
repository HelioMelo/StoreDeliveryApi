import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/user-type.enum';
import { LoginPayloadDTO } from 'src/auth/dto/loginPayload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;

    const loginPayloadDTO: LoginPayloadDTO | undefined = await this.jwtService
      .verifyAsync(authorization, { secret: process.env.JWT_PASS })
      .catch(() => undefined);

    if (!loginPayloadDTO) {
      return false;
    }

    return requiredRoles.some((role) => role === loginPayloadDTO.typeUser);
  }
}
