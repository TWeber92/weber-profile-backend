export class ProjectRepository {
  constructor(client) {
    this.#oort = client;
  }

  #oort;

  async getSchema(key) {
    return await this.#oort.getObject(key);
  }
  async putSchema(key, data) {
    return await this.#oort.putObject(key, data);
  }
}
