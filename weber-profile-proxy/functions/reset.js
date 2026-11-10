import { Client } from "pg";
import { handler as putProject } from "./putProject";
import springSecuritySchema from "../../src/resources/schemas/spring-security.sql";
import authorsNovelsSchema from "../../src/resources/schemas/authors-novels.sql";
import cabBookingSchema from "../../src/resources/schemas/cab-booking.sql";
import mavenLibrarySchema from "../../src/resources/schemas/maven-library.sql";

export const handler = async (env) => {
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
    ssl: { rejectUnauthorized: false },
  });
  
  const makeEvent = (projectName) => ({
    httpMethod: "PUT",
    path: "/api/v1/project",
    queryStringParameters: {},
    body: JSON.stringify({ projectName }),
  });

  await client.connect();
  console.log("Connected to Render DB for reset.");

  await client.query(springSecuritySchema);
  console.log("Spring Security schema reset.");
  await putProject(makeEvent("spring-security"), env);

  await client.query(authorsNovelsSchema);
  console.log("Authors & Novels schema reset.");
  await putProject(makeEvent("authors-novels"), env);

  await client.query(cabBookingSchema);
  console.log("Cab Booking schema reset.");
  await putProject(makeEvent("cab-booking"), env);

  await client.query(mavenLibrarySchema);
  console.log("Maven Library schema reset.");
  await putProject(makeEvent("maven-library"), env);

  console.log("All schemas successfully reset and seeded.");
  return client;
};
