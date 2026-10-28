import { Main } from "../../src/Main";
import { AuthenticationError } from "../../src/weber-profile-exception/WeberProfileError";

export const handler = async (event, env) => {
  let responseStatus = 200;
  let responseBody;
  let responseHeaders = { "Content-Type": "application/json" };

  const auth = event.headers.authorization;
  if (!auth) throw new AuthenticationError("Basic auth required", "postProject");

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded)
    throw new AuthenticationError("Malformed auth header", "postProject");

  const [user, pass] = atob(encoded).split(":");
  if (user !== env.BASIC_ADMIN || pass !== env.BASIC_PASS)
    throw new AuthenticationError("Invalid credentials", "postProject");

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
    statusCode: responseStatus,
    headers: responseHeaders,
    body: responseBody,
  };
};