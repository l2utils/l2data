import { DatSchema } from "../schema";

export const itemnameSchema: DatSchema = {
  name: "itemname-e",
  fields: [
    { name: "id", type: "uint32" },
    { name: "name", type: "unicode" },
    { name: "additionalName", type: "unicode" },
    { name: "description", type: "unicode" },
  ],
};
