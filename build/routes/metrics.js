"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/metrics.ts
var metrics_exports = {};
__export(metrics_exports, {
  metricsRoutes: () => metricsRoutes
});
module.exports = __toCommonJS(metrics_exports);

// src/database.ts
var import_knex = require("knex");
var import_config = require("dotenv/config");

// src/models/env-schema.ts
var import_zod = require("zod");
var import_dotenv = require("dotenv");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test", override: true });
} else {
  (0, import_dotenv.config)({ override: true });
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: import_zod.z.string(),
  DATABASE_CLIENT: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3e3)
});
var envParse = envSchema.safeParse(process.env);
if (!envParse.success) {
  console.error("Invalid environment variables:", envParse.error.format());
  throw new Error("Invalid environment variables");
}
var env = envParse.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/metrics.ts
async function metricsRoutes(app) {
  app.get("/user/:id/metrics", async (request) => {
    const { id } = request.params;
    const totalMeals = await knex("meals").where({ user_id: id }).orderBy("date_and_time", "desc");
    const isPartOfDietMeals = await knex("meals").where({
      user_id: id,
      is_part_of_diet: "yes"
    }).count("id", { as: "total" }).first();
    const isNotPartOfDietMeals = await knex("meals").where({
      user_id: id,
      is_part_of_diet: "no"
    }).count("id", { as: "total" }).first();
    return {
      totalMeals: totalMeals.length,
      isPartOfDietMeals: isPartOfDietMeals?.total,
      isNotPartOfDietMeals: isNotPartOfDietMeals?.total
    };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  metricsRoutes
});
