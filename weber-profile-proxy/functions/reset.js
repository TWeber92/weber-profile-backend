import { Client } from "pg";
import springSecuritySchema from "../../src/resources/schemas/spring-security.sql";
import authorsNovelsSchema from "../../src/resources/schemas/authors-novels.sql";
import cabBookingSchema from "../../src/resources/schemas/cab-booking.sql";
import mavenLibrarySchema from "../../src/resources/schemas/maven-library.sql";

export const handler = async (env) => {
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString, 
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Render DB for reset.");

  await client.query(springSecuritySchema);
  console.log("Spring Security schema reset.");

  await client.query(authorsNovelsSchema);
  console.log("Authors & Novels schema reset.");

  await client.query(cabBookingSchema);
  console.log("Cab Booking schema reset.");

  await client.query(mavenLibrarySchema);
  console.log("Maven Library schema reset.");

  console.log("All schemas successfully reset and seeded.");
  return client;
};
