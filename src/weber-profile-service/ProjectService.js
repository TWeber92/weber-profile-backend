import { ParameterError } from "../weber-profile-exception/WeberProfileError";

export class ProjectService {
  constructor(repo) {
    this.#repo = repo;
  }

  #repo;

  async postProfileProject(projectName, schemaData) {
    if (!projectName || !schemaData) {
      throw new ParameterError("projectName and schemaData are required.");
    }
    const key = `schemas/${projectName}.json`;
    await this.#repo.putSchema(key, schemaData);
  }

  async getProfileProjectByName(projectName) {
    if (!projectName) {
      throw new ParameterError("projectName is required.");
    }
    const key = `schemas/${projectName}.json`;
    return await this.#repo.getSchema(key);
  }
}
