import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const apiVersion = this.configService.get<string>(
          'appConfig.apiVersion',
        );

        if (
          data &&
          typeof data === 'object' &&
          Object.prototype.hasOwnProperty.call(data, 'data') &&
          (Object.prototype.hasOwnProperty.call(data, 'meta') ||
            Object.prototype.hasOwnProperty.call(data, 'links'))
        ) {
          const obj = data as {
            data: unknown;
            meta?: unknown;
            links?: unknown;
          };
          return {
            apiVersion,
            data: obj.data,
            meta: obj.meta,
            links: obj.links,
          };
        }

        return {
          apiVersion,
          data,
        };
      }),
    );
  }
}
