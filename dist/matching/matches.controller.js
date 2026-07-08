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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_matchmaker_decorator_1 = require("../common/decorators/current-matchmaker.decorator");
const matching_service_1 = require("./matching.service");
const update_match_status_dto_1 = require("./dto/update-match-status.dto");
// Separate controller from MatchingController because this operates on a
// persisted Match by its own id (/matches/:id), not nested under /profiles.
let MatchesController = class MatchesController {
    constructor(matchingService) {
        this.matchingService = matchingService;
    }
    updateStatus(mm, id, dto) {
        return this.matchingService.updateStatus(mm.id, id, dto.status);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, current_matchmaker_decorator_1.CurrentMatchmaker)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_match_status_dto_1.UpdateMatchStatusDto]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "updateStatus", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('matches'),
    __metadata("design:paramtypes", [matching_service_1.MatchingService])
], MatchesController);
