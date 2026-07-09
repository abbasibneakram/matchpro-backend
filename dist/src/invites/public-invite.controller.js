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
exports.PublicInviteController = void 0;
const common_1 = require("@nestjs/common");
const invites_service_1 = require("./invites.service");
const submit_invite_profile_dto_1 = require("./dto/submit-invite-profile.dto");
// No JwtAuthGuard anywhere in this controller — deliberately public.
// The token itself is the access boundary: possessing a valid, unused
// token is what authorizes filling in that one profile, once.
let PublicInviteController = class PublicInviteController {
    constructor(invitesService) {
        this.invitesService = invitesService;
    }
    check(token) {
        return this.invitesService.validateInvite(token);
    }
    submit(token, dto) {
        return this.invitesService.submitProfile(token, dto);
    }
};
exports.PublicInviteController = PublicInviteController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicInviteController.prototype, "check", null);
__decorate([
    (0, common_1.Post)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_invite_profile_dto_1.SubmitInviteProfileDto]),
    __metadata("design:returntype", void 0)
], PublicInviteController.prototype, "submit", null);
exports.PublicInviteController = PublicInviteController = __decorate([
    (0, common_1.Controller)('public/invite'),
    __metadata("design:paramtypes", [invites_service_1.InvitesService])
], PublicInviteController);
