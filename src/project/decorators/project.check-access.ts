import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CheckUserAccess = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userId = +request.user.id;
    const recordId = +request.params.id;

    return true;
  },
);
