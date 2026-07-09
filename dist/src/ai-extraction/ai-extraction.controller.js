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
exports.AiExtractionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ai_extraction_service_1 = require("./ai-extraction.service");
const extract_profile_dto_1 = require("./dto/extract-profile.dto");
// Deliberately routed under /profiles (not /ai-extraction) since this is
// conceptually "step one of creating a profile", not a separate resource.
let AiExtractionController = class AiExtractionController {
    constructor(aiExtractionService) {
        this.aiExtractionService = aiExtractionService;
    }
    extract(dto) {
        return this.aiExtractionService.extractProfile(dto.rawText);
    }
};
exports.AiExtractionController = AiExtractionController;
__decorate([
    (0, common_1.Post)('extract'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [extract_profile_dto_1.ExtractProfileDto]),
    __metadata("design:returntype", void 0)
], AiExtractionController.prototype, "extract", null);
exports.AiExtractionController = AiExtractionController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('profiles'),
    __metadata("design:paramtypes", [ai_extraction_service_1.AiExtractionService])
], AiExtractionController);
