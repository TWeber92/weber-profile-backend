export class ProjectRepository {
  constructor(client) {
    this.#oort = client;
  }

  #oort;

  async putSchema(key, data) {
    return await this.#oort.putObject(key, data);
  }
  async getSchema(key) {
    return await this.#oort.getObject(key);
  }
}
