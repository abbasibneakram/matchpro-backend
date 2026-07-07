"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_matchmaker_decorator_1 = require("../common/decorators/current-matchmaker.decorator");
const photos_service_1 = require("./photos.service");
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
let PhotosController = class PhotosController {
    constructor(photosService) {
        this.photosService = photosService;
    }
    upload(mm, profileId, file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        return this.photosService.upload(mm.id, profileId, file);
    }
    list(mm, profileId) {
        return this.photosService.list(mm.id, profileId);
    }
    remove(mm, profileId, photoId) {
        return this.photosService.remove(mm.id, profileId, photoId);
    }
};
exports.PhotosController = PhotosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(), // buffer only, never written to local disk
        limits: { fileSize: MAX_FILE_SIZE_BYTES },
        fileFilter: (_req, file, cb) => {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Only JPEG, PNG, or WEBP images are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, current_matchmaker_decorator_1.CurrentMatchmaker)()),
    __param(1, (0, common_1.Param)('profileId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_matchmaker_decorator_1.CurrentMatchmaker)()),
    __param(1, (0, common_1.Param)('profileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':photoId'),
    __param(0, (0, current_matchmaker_decorator_1.CurrentMatchmaker)()),
    __param(1, (0, common_1.Param)('profileId')),
    __param(2, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PhotosController.prototype, "remove", null);
exports.PhotosController = PhotosController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles/:profileId/photos'),
    __metadata("design:paramtypes", [photos_service_1.PhotosService])
], PhotosController);
