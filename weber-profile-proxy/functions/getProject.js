import { Main } from "../../src/Main";
import { ParameterError } from "../../src/weber-profile-exception/WeberProfileError";

export const handler = async (event, env) => {
  let responseStatus = 200;
  let responseBody;
  const main = new Main(env);
  const controller = main.projectController;
  const projectName = event.queryStringParameters.projectName;
  const req = {
    params: { projectName },
    path: event.path,
    method: event.httpMethod,
  };
  const res = {
    status: (code) => {
      responseStatus = code;
      return {
        json: (data) => {
          responseBody = JSON.stringify(data);
        },
      };
    },
  };
  if (!projectName)
    throw new ParameterError("projectName parameter is required");
  await main.limitController.checkIp(req, res);
  await controller.getProfileProjectByName(req, res);
  return {
    statusCode: responseStatus,
    headers: { "Content-Type": "application/json" },
    body: responseBody,
  };
};
