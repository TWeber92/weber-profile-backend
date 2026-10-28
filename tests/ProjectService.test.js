import { test } from "node:test";
import assert from "node:assert/strict";

import { ProjectService } from "../src/weber-profile-service/ProjectService.js";
import { ProjectRepository } from "../src/weber-profile-repository/ProjectRepository.js";
import { ParameterError } from "../src/weber-profile-exception/WeberProfileError.js";

// ---------------------------------------------------------------------------
// 1. POST: Happy Path
// ---------------------------------------------------------------------------
test("postProfileProject stores the schema in OORT with the correct key", async () => {
  let storedKey = null;
  let storedData = null;

  const fakeOort = {
    putObject: async (key, data) => {
      storedKey = key;
      storedData = data;
      return { key };
    },
  };

  const repo = new ProjectRepository(fakeOort);
  const service = new ProjectService(repo);

  const mockSchema = [{ columns: ["ID"], rows: [{ id: 1 }] }];
  await service.postProfileProject("spring-security", mockSchema);

  assert.equal(storedKey, "schemas/spring-security.json");
  assert.deepEqual(storedData, mockSchema);
});

// ---------------------------------------------------------------------------
// 2. POST: Mad Path (Validation)
// ---------------------------------------------------------------------------
test("postProfileProject rejects if projectName or schemaData is missing", async () => {
  const fakeOort = {
    putObject: async () => {
      throw new Error("OORT should not be called during validation");
    },
  };

  const service = new ProjectService(new ProjectRepository(fakeOort));

  // Missing schemaData
  await assert.rejects(
    () => service.postProfileProject("spring-security"),
    ParameterError
  );

  // Missing projectName
  await assert.rejects(
    () => service.postProfileProject(null, []),
    ParameterError
  );
});

// ---------------------------------------------------------------------------
// 3. GET: Happy Path
// ---------------------------------------------------------------------------
test("getProfileProjectByName returns the schema from OORT", async () => {
  let requestedKey = null;
  const mockSchema = [{ columns: ["ID", "Name"], rows: [] }];

  const fakeOort = {
    getObject: async (key) => {
      requestedKey = key;
      return mockSchema;
    },
  };

  const repo = new ProjectRepository(fakeOort);
  const service = new ProjectService(repo);

  const result = await service.getProfileProjectByName("authors-novels");

  assert.equal(requestedKey, "schemas/authors-novels.json");
  assert.deepEqual(result, mockSchema);
});

// ---------------------------------------------------------------------------
// 4. GET: Mad Path (Validation)
// ---------------------------------------------------------------------------
test("getProfileProjectByName rejects if projectName is missing", async () => {
  const fakeOort = {
    getObject: async () => {
      throw new Error("OORT should not be called during validation");
    },
  };

  const service = new ProjectService(new ProjectRepository(fakeOort));

  await assert.rejects(
    () => service.getProfileProjectByName(), 
    ParameterError
  );
});