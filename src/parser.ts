import { BinaryReader } from "./reader";
import { DatSchema, ParsedDatFile, DatRow } from "./schema";

export function parseDat(
  data: Buffer | Uint8Array,
  schema: DatSchema,
  explicitRowCount?: number
): ParsedDatFile {
  const reader = new BinaryReader(data);

  // Lineage 2 .dat files typically start with a 4-byte uint32 row count
  const rowCount = explicitRowCount !== undefined ? explicitRowCount : reader.readUInt32();
  const rows: DatRow[] = [];
  const columns = schema.fields.map((f) => f.name);

  for (let r = 0; r < rowCount; r++) {
    if (reader.isEOF) break;

    const row: DatRow = {};
    for (const field of schema.fields) {
      switch (field.type) {
        case "byte":
          row[field.name] = reader.readByte();
          break;
        case "int8":
          row[field.name] = reader.readInt8();
          break;
        case "uint16":
          row[field.name] = reader.readUInt16();
          break;
        case "int16":
          row[field.name] = reader.readInt16();
          break;
        case "uint32":
          row[field.name] = reader.readUInt32();
          break;
        case "int32":
          row[field.name] = reader.readInt32();
          break;
        case "uint64":
          row[field.name] = reader.readBigUInt64();
          break;
        case "int64":
          row[field.name] = reader.readBigInt64();
          break;
        case "float":
          row[field.name] = reader.readFloat();
          break;
        case "double":
          row[field.name] = reader.readDouble();
          break;
        case "ascii":
          row[field.name] = reader.readAsciiString(field.length);
          break;
        case "unicode":
          row[field.name] = reader.readUnicodeString(field.length);
          break;
        default:
          throw new Error(`Unknown field type: ${field.type}`);
      }
    }
    rows.push(row);
  }

  return {
    schema: schema.name,
    rowCount: rows.length,
    columns,
    rows,
  };
}
