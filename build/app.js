"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/routes/users.ts
var import_crypto = require("crypto");

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

// src/models/create-user-schema.ts
var import_zod2 = require("zod");
var CreateUserSchema = import_zod2.z.object({
  name: import_zod2.z.string()
});

// src/routes/users.ts
async function usersRoutes(app2) {
  app2.get("/", async () => {
    const users = await knex("users").select();
    return { users };
  });
  app2.post("/", async (request, reply) => {
    const { name } = CreateUserSchema.parse(request.body);
    await knex("users").insert({
      id: (0, import_crypto.randomUUID)(),
      name
    });
    return reply.status(201).send();
  });
}

// src/models/create-meal-schema.ts
var import_zod3 = require("zod");
var stringToDate = import_zod3.z.preprocess((value) => {
  if (typeof value === "string") {
    return new Date(value);
  }
  return value;
}, import_zod3.z.date());
var createMealSchema = import_zod3.z.object({
  name: import_zod3.z.string(),
  description: import_zod3.z.string(),
  isPartOfDiet: import_zod3.z.enum(["yes", "no"]),
  dateAndTime: stringToDate
});

// src/routes/meals.ts
var import_crypto2 = require("crypto");

// src/utils/date.ts
function formattedDate(date) {
  return new Date(date).toLocaleString();
}

// src/routes/meals.ts
async function mealsRoutes(app2) {
  app2.get("/user/:userId/meals", async (request) => {
    const { userId } = request.params;
    const meals = await knex("meals").where({ user_id: userId });
    return { meals };
  });
  app2.get("/meal/:id", async (request) => {
    const { id } = request.params;
    const meal = await knex("meals").where({ id }).select().first();
    return { meal };
  });
  app2.post("/user/:userId/meal", async (request, reply) => {
    const { name, description, dateAndTime, isPartOfDiet } = createMealSchema.parse(request.body);
    const { userId } = request.params;
    await knex("meals").insert({
      id: (0, import_crypto2.randomUUID)(),
      name,
      description,
      date_and_time: formattedDate(dateAndTime),
      is_part_of_diet: isPartOfDiet,
      user_id: userId
    });
    return reply.status(201).send();
  });
  app2.put("/meal/:id", async (request, reply) => {
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
  app2.delete("/meal/:id", async (request, reply) => {
    const { id } = request.params;
    await knex("meals").where({ id }).delete();
    return reply.status(204).send();
  });
}

// src/routes/metrics.ts
async function metricsRoutes(app2) {
  app2.get("/user/:id/metrics", async (request) => {
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

// src/app.ts
var app = (0, import_fastify.default)();
app.register(metricsRoutes);
app.register(mealsRoutes);
app.register(usersRoutes, {
  prefix: "/users"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
