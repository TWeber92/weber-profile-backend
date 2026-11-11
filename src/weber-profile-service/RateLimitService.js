import { RateLimitError } from "../weber-profile-exception/WeberProfileError";
import { Logger } from "../weber-profile-utilities/Logger";

export class RateLimitService {
  constructor(repo) {
    this.#repo = repo;
  }
  #repo;
  async checkIp(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const limit = 20;
    const record = await this.#repo.getRecord(ip);
    record.requests = record.requests.filter((t) => now - t < windowMs);
    if (record.requests.length >= limit)
      Logger.throw(
        new RateLimitError("Too many requests. Try again later."),
        "RateLimitService.checkIp",
        { ip, count: record.requests.length, limit, windowMs },
      );
    record.requests.push(now);
    await this.#repo.putRecord(ip, record);
    return null;
  }
}
