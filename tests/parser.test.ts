import { parseDat } from "../src/parser";
import { DatSchema } from "../src/schema";

describe("parseDat", () => {
  const testSchema: DatSchema = {
    name: "test_items",
    fields: [
      { name: "id", type: "uint32" },
      { name: "name", type: "unicode" },
      { name: "price", type: "uint32" },
    ],
  };

  test("parses binary stream according to schema", () => {
    // 1 row count (uint32 = 4 bytes)
    // Row 1: id=57 (uint32), name="Adena\0" (unicode = 12 bytes), price=1 (uint32)
    const nameBuf = Buffer.from("Adena\0", "utf-16le");
    const totalSize = 4 + 4 + nameBuf.length + 4;
    const buf = Buffer.alloc(totalSize);

    buf.writeUInt32LE(1, 0); // Row count = 1
    buf.writeUInt32LE(57, 4); // ID = 57
    nameBuf.copy(buf, 8); // Name = "Adena\0"
    buf.writeUInt32LE(1, 8 + nameBuf.length); // Price = 1

    const result = parseDat(buf, testSchema);
    expect(result.rowCount).toBe(1);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].id).toBe(57);
    expect(result.rows[0].name).toBe("Adena");
    expect(result.rows[0].price).toBe(1);
  });
});
