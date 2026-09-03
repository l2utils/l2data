import { BinaryReader } from "../src/reader";

describe("BinaryReader", () => {
  test("reads primitive numeric types correctly", () => {
    const buf = Buffer.alloc(32);
    buf.writeUInt8(42, 0);
    buf.writeInt8(-10, 1);
    buf.writeUInt16LE(1000, 2);
    buf.writeInt16LE(-500, 4);
    buf.writeUInt32LE(100000, 6);
    buf.writeInt32LE(-200000, 10);
    buf.writeFloatLE(3.14, 14);
    buf.writeDoubleLE(2.71828, 18);

    const reader = new BinaryReader(buf);
    expect(reader.readByte()).toBe(42);
    expect(reader.readInt8()).toBe(-10);
    expect(reader.readUInt16()).toBe(1000);
    expect(reader.readInt16()).toBe(-500);
    expect(reader.readUInt32()).toBe(100000);
    expect(reader.readInt32()).toBe(-200000);
    expect(reader.readFloat()).toBeCloseTo(3.14, 2);
    expect(reader.readDouble()).toBeCloseTo(2.71828, 4);
  });

  test("reads 64-bit integers correctly", () => {
    const buf = Buffer.alloc(16);
    buf.writeBigUInt64LE(1234567890123456789n, 0);
    buf.writeBigInt64LE(-987654321098765432n, 8);

    const reader = new BinaryReader(buf);
    expect(reader.readBigUInt64()).toBe(1234567890123456789n);
    expect(reader.readBigInt64()).toBe(-987654321098765432n);
  });

  test("reads unicode strings correctly", () => {
    const str = "Aden\0";
    const buf = Buffer.from(str, "utf-16le");
    const reader = new BinaryReader(buf);

    expect(reader.readUnicodeString()).toBe("Aden");
  });

  test("reads ascii strings correctly", () => {
    const str = "Giran\0";
    const buf = Buffer.from(str, "utf-8");
    const reader = new BinaryReader(buf);

    expect(reader.readAsciiString()).toBe("Giran");
  });

  test("throws on out of bounds seek or read", () => {
    const reader = new BinaryReader(Buffer.alloc(4));
    expect(() => reader.seek(10)).toThrow(RangeError);
    expect(() => reader.readBytes(5)).toThrow(RangeError);
  });
});
