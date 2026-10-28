import { OORTStorageClient } from "./weber-profile-client/OORTStorageClient";
import { ProjectController } from "./weber-profile-controller/ProjectController";
import { RateLimitController } from "./weber-profile-controller/RateLimitController";
import { ProjectRepository } from "./weber-profile-repository/ProjectRepository";
import { RateLimitRepository } from "./weber-profile-repository/RateLimitRepository";
import { ProjectService } from "./weber-profile-service/ProjectService";
import { RateLimitService } from "./weber-profile-service/RateLimitService";

export class Main {
  constructor(env) {
    this.#oort = new OORTStorageClient(
      env.OORT_ACCESS_KEY,
      env.OORT_SECRET_KEY,
      env.OORT_BUCKET_2,
    );
    this.projectController = this.#buildProjectController();
    this.limitController = this.#buildRateLimitController()
  }
  #oort;

  #buildProjectController() {
    const repo = new ProjectRepository(this.#oort);
    const service = new ProjectService(repo);
    return new ProjectController(service);
  }
  #buildRateLimitController(){
    const repo = new RateLimitRepository(this.#oort);
    const service = new RateLimitService(repo);
    return RateLimitController(service)
  }
}
