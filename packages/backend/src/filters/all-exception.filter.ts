import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Server Error'
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      message = exception.message
    }

    response.status(status).json({
      message: message,
      status,
    })
  }
}
