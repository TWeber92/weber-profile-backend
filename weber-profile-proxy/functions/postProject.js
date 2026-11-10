import { Main } from "../../src/Main";
import { AuthenticationError } from "../../src/weber-profile-exception/WeberProfileError";
import { Logger } from "../../src/weber-profile-utilities/Logger";

export const handler = async (event, env) => {
  let responseStatus = 200;
  let responseBody;

  const auth = event.headers.authorization;
  if (!auth)
    Logger.throw(
      new AuthenticationError("Basic auth required", "postProject"),
      "postProject.auth",
    );

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded)
    Logger.throw(
      new AuthenticationError("Malformed auth header", "postProject"),
      "postProject.auth",
      { scheme },
    );

  const [user, pass] = atob(encoded).split(":");
  if (user !== env.BASIC_ADMIN || pass !== env.BASIC_PASS)
    Logger.throw(
      new AuthenticationError("Invalid credentials", "postProject"),
      "postProject.auth",
      { user },
    );

  const main = new Main(env);
  const controller = main.projectController;

  const req = {
    body: JSON.parse(event.body || "{}"),
    headers: event.headers,
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

  await controller.postProfileProject(req, res);

  return {
    status: responseStatus,
    body: responseBody,
  };
};
