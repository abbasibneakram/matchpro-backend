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
exports.StorageProvider = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const SIGNED_URL_TTL_SECONDS = 300; // 5 minutes — long enough to load a gallery, short enough to limit exposure if a URL leaks
// Wraps the S3-compatible client so the rest of the app never touches the
// SDK directly. Works as-is against Cloudflare R2, Backblaze B2, or AWS S3 —
// swap credentials/endpoint in .env, no code changes needed.
let StorageProvider = class StorageProvider {
    constructor() {
        this.bucket = process.env.STORAGE_BUCKET;
        this.client = new client_s3_1.S3Client({
            region: process.env.STORAGE_REGION || 'auto',
            endpoint: process.env.STORAGE_ENDPOINT,
            credentials: {
                accessKeyId: process.env.STORAGE_ACCESS_KEY,
                secretAccessKey: process.env.STORAGE_SECRET_KEY,
            },
        });
    }
    async upload(key, body, contentType) {
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
            // No ACL set — bucket must be private. Access only ever happens
            // through short-lived signed URLs generated below.
        }));
    }
    async getSignedGetUrl(key) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: SIGNED_URL_TTL_SECONDS });
    }
    async delete(key) {
        await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
};
exports.StorageProvider = StorageProvider;
exports.StorageProvider = StorageProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageProvider);
