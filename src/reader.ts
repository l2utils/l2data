export class BinaryReader {
  private buffer: Buffer;
  private offset: number;

  constructor(data: Buffer | Uint8Array) {
    this.buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    this.offset = 0;
  }

  public get position(): number {
    return this.offset;
  }

  public get length(): number {
    return this.buffer.length;
  }

  public get isEOF(): boolean {
    return this.offset >= this.buffer.length;
  }

  public seek(position: number): void {
    if (position < 0 || position > this.buffer.length) {
      throw new RangeError(`Seek position out of bounds: ${position}`);
    }
    this.offset = position;
  }

  public skip(bytes: number): void {
    this.seek(this.offset + bytes);
  }

  public readByte(): number {
    this.ensureAvailable(1);
    const val = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return val;
  }

  public readInt8(): number {
    this.ensureAvailable(1);
    const val = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return val;
  }

  public readUInt16(): number {
    this.ensureAvailable(2);
    const val = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return val;
  }

  public readInt16(): number {
    this.ensureAvailable(2);
    const val = this.buffer.readInt16LE(this.offset);
    this.offset += 2;
    return val;
  }

  public readUInt32(): number {
    this.ensureAvailable(4);
    const val = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return val;
  }

  public readInt32(): number {
    this.ensureAvailable(4);
    const val = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return val;
  }

  public readBigInt64(): bigint {
    this.ensureAvailable(8);
    const val = this.buffer.readBigInt64LE(this.offset);
    this.offset += 8;
    return val;
  }

  public readBigUInt64(): bigint {
    this.ensureAvailable(8);
    const val = this.buffer.readBigUInt64LE(this.offset);
    this.offset += 8;
    return val;
  }

  public readFloat(): number {
    this.ensureAvailable(4);
    const val = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return val;
  }

  public readDouble(): number {
    this.ensureAvailable(8);
    const val = this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return val;
  }

  public readBytes(count: number): Buffer {
    this.ensureAvailable(count);
    const slice = this.buffer.subarray(this.offset, this.offset + count);
    this.offset += count;
    return Buffer.from(slice);
  }

  /**
   * Reads a length-prefixed or null-terminated UTF-16LE unicode string
   */
  public readUnicodeString(charCount?: number): string {
    if (charCount !== undefined) {
      const byteCount = charCount * 2;
      this.ensureAvailable(byteCount);
      const str = this.buffer.toString("utf-16le", this.offset, this.offset + byteCount);
      this.offset += byteCount;
      return str.replace(/\0+$/, "");
    }

    // Read null-terminated string
    let end = this.offset;
    while (end + 1 < this.buffer.length) {
      if (this.buffer[end] === 0 && this.buffer[end + 1] === 0) {
        break;
      }
      end += 2;
    }
    const str = this.buffer.toString("utf-16le", this.offset, end);
    this.offset = Math.min(end + 2, this.buffer.length);
    return str;
  }

  /**
   * Reads an ASCII / UTF-8 string
   */
  public readAsciiString(byteCount?: number): string {
    if (byteCount !== undefined) {
      this.ensureAvailable(byteCount);
      const str = this.buffer.toString("utf-8", this.offset, this.offset + byteCount);
      this.offset += byteCount;
      return str.replace(/\0+$/, "");
    }

    let end = this.offset;
    while (end < this.buffer.length && this.buffer[end] !== 0) {
      end++;
    }
    const str = this.buffer.toString("utf-8", this.offset, end);
    this.offset = Math.min(end + 1, this.buffer.length);
    return str;
  }

  private ensureAvailable(bytes: number): void {
    if (this.offset + bytes > this.buffer.length) {
      throw new RangeError(
        `Unexpected EOF: attempted to read ${bytes} bytes at offset ${this.offset}, buffer length is ${this.buffer.length}`
      );
    }
  }
}
