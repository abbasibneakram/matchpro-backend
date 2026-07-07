"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitInviteProfileDto = void 0;
// Same shape and validation as CreateProfileDto — a client filling their own
// profile via an invite link provides exactly the same fields a matchmaker
// would enter manually. matchmakerId and status are set by the server from
// the invite token, never accepted from this public endpoint.
var create_profile_dto_1 = require("../../profiles/dto/create-profile.dto");
Object.defineProperty(exports, "SubmitInviteProfileDto", { enumerable: true, get: function () { return create_profile_dto_1.CreateProfileDto; } });
