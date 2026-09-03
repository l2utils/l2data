#!/usr/bin/env node
import fs from "node:fs/promises";
import { resolve } from "node:path";
import { Command } from "commander";
import { parseDat } from "./parser";
import { itemnameSchema } from "./schemas/itemname";
import { DatSchema } from "./schema";

const schemas: Record<string, DatSchema> = {
  itemname: itemnameSchema,
  "itemname-e": itemnameSchema,
};

const program = new Command();

program
  .name("l2data")
  .description("Lineage 2 binary .dat file deserializer")
  .version("0.1.0")
  .argument("[input]", "Input .dat file path")
  .option("-i, --input <path>", "Input file path")
  .option("-o, --output <path>", "Output JSON file path")
  .option("-s, --schema <name>", "Schema name (e.g. itemname, itemgrp)", "itemname")
  .action(async (positionalInput, options) => {
    const inputPath = options.input || positionalInput;
    if (!inputPath) {
      console.error("Error: input file is required");
      program.help();
      process.exit(1);
    }

    const schema = schemas[options.schema];
    if (!schema) {
      console.error(`Error: unknown schema '${options.schema}'. Available: ${Object.keys(schemas).join(", ")}`);
      process.exit(1);
    }

    try {
      const fileBuffer = await fs.readFile(resolve(inputPath));
      const parsed = parseDat(fileBuffer, schema);
      const jsonOutput = JSON.stringify(parsed, null, 2);

      if (options.output) {
        await fs.writeFile(resolve(options.output), jsonOutput, "utf-8");
        console.info(`Successfully parsed ${parsed.rowCount} rows to ${options.output}`);
      } else {
        process.stdout.write(jsonOutput);
      }
    } catch (err) {
      console.error(`Failed to parse file: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
