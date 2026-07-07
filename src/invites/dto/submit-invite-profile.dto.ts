// Same shape and validation as CreateProfileDto — a client filling their own
// profile via an invite link provides exactly the same fields a matchmaker
// would enter manually. matchmakerId and status are set by the server from
// the invite token, never accepted from this public endpoint.
export { CreateProfileDto as SubmitInviteProfileDto } from '../../profiles/dto/create-profile.dto';
