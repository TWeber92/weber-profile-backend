export class RateLimitController {
  constructor(service) {
    this.#service = service;
  }
  #service;

  async checkIp(req, res) {
    const ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["local-connecting-ip"] ||
      "unknown";
    const data = await this.#service.checkIp(ip);
    res.status(200).json({ data });
  }
}
