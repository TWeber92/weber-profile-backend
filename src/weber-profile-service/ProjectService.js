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
    const key = `schemas/${projectName}`;
    return await this.#repo.getSchema(key);
  }
  async postProfileProject(projectName, schemaData) {
    if (!projectName || !schemaData)
      Logger.throw(
        new ParameterError("projectName and tables are required."),
        "ProjectService.postProfileProject",
      );
    const key = `schemas/${projectName}`;
    await this.#repo.putSchema(key, schemaData);
  }

  async putProfileProject(projectName, tables) {
    console.log(projectName, tables);
    
    const key = `schemas/${projectName}`;
    const wrapped = Project.from(tables);
    await this.#repo.putSchema(key, wrapped);
  }
}
