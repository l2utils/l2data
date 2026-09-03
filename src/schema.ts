export type DataType =
  | "byte"
  | "int8"
  | "uint16"
  | "int16"
  | "uint32"
  | "int32"
  | "uint64"
  | "int64"
  | "float"
  | "double"
  | "ascii"
  | "unicode";

export interface FieldDefinition {
  name: string;
  type: DataType;
  length?: number; // Optional length for fixed strings
}

export interface DatSchema {
  name: string;
  chronicle?: string;
  fields: FieldDefinition[];
}

export interface DatRow {
  [key: string]: number | string | bigint;
}

export interface ParsedDatFile {
  schema: string;
  rowCount: number;
  columns: string[];
  rows: DatRow[];
}
