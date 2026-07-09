"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentMatchmaker = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentMatchmaker = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // { id, email } — set by JwtStrategy.validate()
});
