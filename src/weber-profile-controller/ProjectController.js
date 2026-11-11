export class ProjectController {
  constructor(service) {
    this.#service = service;
  }

  #service;

  async getProfileProjectByName(req, res) {
    const { projectName } = req.params;
    console.log(projectName, 1);
    
    const project = await this.#service.getProfileProjectByName(projectName);
    res.status(200).json({ data: project });
  }

  async postProfileProject(req, res) {
    const { projectName, schemaData } = req.body;
    await this.#service.postProfileProject(projectName, schemaData);
    res
      .status(200)
      .json({
        data: { message: `Schema for ${projectName} saved successfully.` },
      });
  }
  async putProfileProject(req, res) {
    const { projectName, tables } = req.body;
    await this.#service.putProfileProject(projectName, tables);
    res
      .status(200)
      .json({
        data: { message: `Schema for ${projectName} reset successfully.` },
      });
  }
}
