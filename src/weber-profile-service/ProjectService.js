import { Project } from "../weber-profile-entity/Project";
import { ParameterError } from "../weber-profile-exception/WeberProfileError";
import { Logger } from "../weber-profile-utilities/Logger";

export class ProjectService {
  constructor(repo) {
    this.#repo = repo;
  }

  #repo;

  async getProfileProjectByName(projectName) {
    if (!projectName)
      Logger.throw(
        new ParameterError("projectName is required."),
        "ProjectService.getProfileProjectByName",
      );
    const key = `schemas/${projectName}.json`;
    return await this.#repo.getSchema(key);
  }
  async postProfileProject(projectName, schemaData) {
    if (!projectName || !schemaData)
      Logger.throw(
        new ParameterError("projectName and tables are required."),
        "ProjectService.postProfileProject",
      );
    const key = `schemas/${projectName}.json`;
    await this.#repo.putSchema(key, schemaData);
  }

  async putProfileProject(projectName, tables) {
    const key = `schemas/${projectName}.json`;
    const wrapped = Project.from(tables);
    console.log(wrapped);
    console.log("typeof wrapped:", typeof wrapped);
    console.log("isArray:", Array.isArray(wrapped));
    console.log("wrapped[0]:", JSON.stringify(wrapped[0]).slice(0, 300));
    console.log("stringified length:", JSON.stringify(wrapped).length);
    await this.#repo.putSchema(key, wrapped);
  }
}
