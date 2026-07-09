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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = exports.ProfileStatusDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const create_profile_dto_1 = require("./create-profile.dto");
var ProfileStatusDto;
(function (ProfileStatusDto) {
    ProfileStatusDto["PENDING_REVIEW"] = "PENDING_REVIEW";
    ProfileStatusDto["ACTIVE"] = "ACTIVE";
    ProfileStatusDto["INACTIVE"] = "INACTIVE";
})(ProfileStatusDto || (exports.ProfileStatusDto = ProfileStatusDto = {}));
// PartialType makes every CreateProfileDto field optional for edits,
// plus status which only makes sense on update (e.g. activating a profile).
class UpdateProfileDto extends (0, mapped_types_1.PartialType)(create_profile_dto_1.CreateProfileDto) {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ProfileStatusDto),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "status", void 0);
