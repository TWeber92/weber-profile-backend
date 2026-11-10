import { Client } from "pg";
import { PROJECT_TABLES } from "../../src/weber-profile-enum/ProjectTables";
import { Main } from "../../src/Main";

export const handler = async (event, env) => {
  let responseStatus = 200;
  let responseBody;
  const controller = new Main(env).projectController;
  const { projectName } = JSON.parse(event.body || "{}");
  const req = { body: { projectName } };
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
  const cfg = PROJECT_TABLES[projectName];
  if (!cfg) return { status: 400, body: { error: "Unknown projectName" } };

  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const getData = async () => {
    const tables = {};
    for (const [tableName, columns] of Object.entries(cfg.tables)) {
      const sql = `SELECT ${columns.join(", ")} FROM ${cfg.schema}.${tableName}`;
      const { rows } = await client.query(sql);
      tables[tableName] = { columns, rows };
    }
    return tables;
  };
  req.body.tables = await getData();
  await controller.putProfileProject(req, res);
  await client.end();
};
