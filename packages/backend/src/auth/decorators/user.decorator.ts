import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return prop ? request.user[prop] : request.user
  }
)
