import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export const CustomBook = createParamDecorator(
    (data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>();
        return request.bodyUsed
    }
)