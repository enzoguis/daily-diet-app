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

// src/routes/meals.ts
var meals_exports = {};
__export(meals_exports, {
  mealsRoutes: () => mealsRoutes
});
module.exports = __toCommonJS(meals_exports);

// src/models/create-meal-schema.ts
var import_zod = require("zod");
var stringToDate = import_zod.z.preprocess((value) => {
  if (typeof value === "string") {
    return new Date(value);
  }
  return value;
}, import_zod.z.date());
var createMealSchema = import_zod.z.object({
  name: import_zod.z.string(),
  description: import_zod.z.string(),
  isPartOfDiet: import_zod.z.enum(["yes", "no"]),
  dateAndTime: stringToDate
});

// src/database.ts
var import_knex = require("knex");
var import_config = require("dotenv/config");

// src/models/env-schema.ts
var import_zod2 = require("zod");
var import_dotenv = require("dotenv");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test", override: true });
} else {
  (0, import_dotenv.config)({ override: true });
}
var envSchema = import_zod2.z.object({
  NODE_ENV: import_zod2.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: import_zod2.z.string(),
  DATABASE_CLIENT: import_zod2.z.string(),
  PORT: import_zod2.z.coerce.number().default(3e3)
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

// src/routes/meals.ts
var import_crypto = require("crypto");

// src/utils/date.ts
function formattedDate(date) {
  return new Date(date).toLocaleString();
}

// src/routes/meals.ts
async function mealsRoutes(app) {
  app.get("/user/:userId/meals", async (request) => {
    const { userId } = request.params;
    const meals = await knex("meals").where({ user_id: userId });
    return { meals };
  });
  app.get("/meal/:id", async (request) => {
    const { id } = request.params;
    const meal = await knex("meals").where({ id }).select().first();
    return { meal };
  });
  app.post("/user/:userId/meal", async (request, reply) => {
    const { name, description, dateAndTime, isPartOfDiet } = createMealSchema.parse(request.body);
    const { userId } = request.params;
    await knex("meals").insert({
      id: (0, import_crypto.randomUUID)(),
      name,
      description,
      date_and_time: formattedDate(dateAndTime),
      is_part_of_diet: isPartOfDiet,
      user_id: userId
    });
    return reply.status(201).send();
  });
  app.put("/meal/:id", async (request, reply) => {
    const { id } = request.params;
    const { name, description, dateAndTime, isPartOfDiet } = createMealSchema.parse(request.body);
    await knex("meals").where({ id }).update({
      name,
      description,
      is_part_of_diet: isPartOfDiet,
      date_and_time: formattedDate(dateAndTime)
    });
    return reply.status(200).send();
  });
  app.delete("/meal/:id", async (request, reply) => {
    const { id } = request.params;
    await knex("meals").where({ id }).delete();
    return reply.status(204).send();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mealsRoutes
});
