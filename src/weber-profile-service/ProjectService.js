export class ProjectService {
  constructor(repo) {
    this.#repo = repo;
  }

  #repo;

  async postProfileProject(projectName, schemaData) {
    const key = `schemas/${projectName}.json`;
    await this.#repo.putSchema(key, schemaData);
  }
}
