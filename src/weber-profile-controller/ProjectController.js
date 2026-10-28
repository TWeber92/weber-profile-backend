import { APIController } from "./APIController";

export class ProjectController extends APIController {
  constructor(service) {
    super();
    this.#service = service;
  }

  #service;

  async getProfileProjectByName(req, res) {
    return super.GET(req, res, "getProfileProjectByName", async () => {
      const { projectName } = req.body;
      const project = await this.#service.getProfileProjectByName(projectName);
      return { status: 200, data: project };
    });
  }

  async postProfileProject(req, res) {
    return super.POST(req, res, "postProfileProject", async () => {
      const { projectName, schemaData } = req.body;
      await this.#service.postProfileProject(projectName, schemaData);
      return {
        status: 200,
        data: { message: `Schema for ${projectName} saved successfully.` },
      };
    });
  }
}
