import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator( (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (request && 'user' in request) {
      return request.user;
    }
    return null;
  },
);
