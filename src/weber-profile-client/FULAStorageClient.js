import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { XMLParser } from "fast-xml-parser";
import { FulaError } from "../weber-profile-exception/WeberProfileError";
import { Logger } from "../weber-profile-utilities/Logger";
export class FULAStorageClient {
  constructor(key, bucket) {
    this.client = new S3Client({
      endpoint: "https://s3.cloud.fx.land",
      region: "us-east-1",
      credentials: {
        accessKeyId: `JWT:${key}`,
        secretAccessKey: "not-used",
      },
      forcePathStyle: true,
    });
    this.bucket = bucket || "myapp-main";
  }
  async getObject(key) {
    console.log(key);
    
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const res = await this.FULA(command);
    const text = await res.Body.transformToString();
    return JSON.parse(text);
  }

  async putObject(key, dataObject) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: JSON.stringify(dataObject),
      ContentType: "application/json",
    });
    return await this.FULA(command);
  }

  async deleteObject(key) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const result = await this.FULA(command);
    return { ...result, key };
  }
  async FULA(command) {
    try {
      const res = await this.client.send(command);
      return res;
    } catch (error) {
      const operation = command.constructor.name;
      const code = error.Code;
      const key = error.Key;
      const status = error.$metadata?.httpStatusCode;
      if (code) {
        const message = this.#getFriendlyMessage(code, operation, key);
        Logger.throw(
          new FulaError(message, error, code, status),
          "FULAStorageClient.FULA",
          { key, code },
        );
      }
      if (error.$responseBodyText) {
        const parser = new XMLParser();
        const parsed = parser.parse(error.$responseBodyText);
        const parsedCode = parsed?.Error?.Code;
        const parsedKey = parsed?.Error?.Key;
        const message = this.#getFriendlyMessage(
          parsedCode,
          operation,
          parsedKey,
        );
        Logger.throw(
          new FulaError(message, parsed.Error, parsedCode, status),
          "FULAStorageClient.FULA",
          { key: parsedKey, code: parsedCode },
        );
      }
      Logger.throw(
        new FulaError(
          `${operation} failed: ${error.message}`,
          error,
          "NetworkFailure",
          status,
        ),
        "FULAStorageClient.FULA",
        { command: operation },
      );
    }
  }
  #getFriendlyMessage(code, operation, key) {
    const map = {
      NoSuchKey: `Resource "${key}" not found`,
      AccessDenied: `Permission denied for "${key}"`,
      NoSuchBucket: "Storage bucket not found",
      SlowDown: "Too many requests, please try again later",
      NoSuchObjectStat: `Object path: ${key} does not exist`,
      PreconditionFailed: `Resource "${key}" already exists`,
    };
    return `${operation}: ${map[code] || `failed for "${key}"`}`;
  }
}
