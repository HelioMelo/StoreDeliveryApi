import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { authorizantionToLogin } from 'src/utils/base-64-converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload = authorizantionToLogin(authorization);

  return loginPayload?.id;
});
