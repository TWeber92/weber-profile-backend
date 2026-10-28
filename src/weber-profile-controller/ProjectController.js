import { ParameterError } from "../weber-profile-exception/WeberProfileError";
import { APIController } from "./APIController";

export class ProjectController extends APIController {
  constructor(service) {
    this.#service = service;
  }

  #service;

  async getProfileProjectByName(req, res) {
    return super.GET(req, res, "getProfileProjectByName", async () => {
      const { projectName } = req.body;
      if (!projectName)
        throw new ParameterError(
          "projectName is required as a parameter.",
        );
      const project = await this.#service.postProfileProject(
        projectName
      );
      return { status: 200, data: project };
    });
  }

  async postProfileProject(req, res) {
    return super.POST(req, res, "postProfileProject", async () => {
      const { projectName, schemaData } = req.body;
      if (!projectName || !schemaData)
        throw new ParameterError(
          "projectName and schemaData are required in the body.",
        );
      await this.#service.postProfileProject(projectName, schemaData);
      return {
        status: 200,
        data: { message: `Schema for ${projectName} saved successfully.` },
      };
    });
  }
}
