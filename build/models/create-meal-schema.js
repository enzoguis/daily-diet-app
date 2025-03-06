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

// src/models/create-meal-schema.ts
var create_meal_schema_exports = {};
__export(create_meal_schema_exports, {
  createMealSchema: () => createMealSchema
});
module.exports = __toCommonJS(create_meal_schema_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMealSchema
});
