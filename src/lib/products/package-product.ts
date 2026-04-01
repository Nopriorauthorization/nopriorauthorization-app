import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

export class PackagingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackagingError";
  }
}

export type PackageResult = {
  archivePath: string;
  fileCount: number;
  entries: string[];
};

/**
 * Builds a ZIP archive from a list of { diskPath, archiveName } entries.
 *
 * Uses Node built-in zlib via a minimal ZIP writer (no external deps).
 * For production-grade ZIP with compression, swap to `archiver` or `yazl`.
 * This implementation writes a valid uncompressed (STORE) ZIP which is fine
 * for HTML/PDF/text bundles.
 */
export async function packageProduct(
  files: { diskPath: string; archiveName: string }[],
  outputZipPath: string,
): Promise<PackageResult> {
  if (files.length === 0) {
    throw new PackagingError("Cannot create empty ZIP archive");
  }

  for (const f of files) {
    if (f.archiveName.includes("..") || path.isAbsolute(f.archiveName)) {
      throw new PackagingError(
        `Unsafe archive entry name: ${f.archiveName}`,
      );
    }
    if (!fs.existsSync(f.diskPath)) {
      throw new PackagingError(`File not found: ${f.diskPath}`);
    }
  }

  fs.mkdirSync(path.dirname(outputZipPath), { recursive: true });

  const entries: ZipEntry[] = [];
  for (const f of files) {
    const data = fs.readFileSync(f.diskPath);
    entries.push({ name: f.archiveName, data });
  }

  const zipBuffer = buildZipBuffer(entries);
  fs.writeFileSync(outputZipPath, zipBuffer);

  return {
    archivePath: outputZipPath,
    fileCount: files.length,
    entries: files.map((f) => f.archiveName),
  };
}

type ZipEntry = { name: string; data: Buffer };

function buildZipBuffer(entries: ZipEntry[]): Buffer {
  const parts: Buffer[] = [];
  const centralDir: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.name, "utf8");
    const localHeader = buildLocalFileHeader(nameBytes, entry.data);
    parts.push(localHeader, nameBytes, entry.data);

    const cdRecord = buildCentralDirEntry(
      nameBytes,
      entry.data,
      offset,
    );
    centralDir.push(cdRecord);

    offset += localHeader.length + nameBytes.length + entry.data.length;
  }

  const cdOffset = offset;
  const cdBuf = Buffer.concat(centralDir);
  parts.push(cdBuf);

  const eocd = buildEndOfCentralDir(
    entries.length,
    cdBuf.length,
    cdOffset,
  );
  parts.push(eocd);

  return Buffer.concat(parts);
}

function buildLocalFileHeader(name: Buffer, data: Buffer): Buffer {
  const buf = Buffer.alloc(30);
  buf.writeUInt32LE(0x04034b50, 0); // local file header sig
  buf.writeUInt16LE(20, 4);         // version needed
  buf.writeUInt16LE(0, 6);          // flags
  buf.writeUInt16LE(0, 8);          // compression: STORE
  buf.writeUInt16LE(0, 10);         // mod time
  buf.writeUInt16LE(0, 12);         // mod date
  buf.writeUInt32LE(crc32(data), 14);
  buf.writeUInt32LE(data.length, 18); // compressed size
  buf.writeUInt32LE(data.length, 22); // uncompressed size
  buf.writeUInt16LE(name.length, 26); // name length
  buf.writeUInt16LE(0, 28);           // extra field length
  return buf;
}

function buildCentralDirEntry(
  name: Buffer,
  data: Buffer,
  localHeaderOffset: number,
): Buffer {
  const buf = Buffer.alloc(46 + name.length);
  buf.writeUInt32LE(0x02014b50, 0); // central dir sig
  buf.writeUInt16LE(20, 4);         // version made by
  buf.writeUInt16LE(20, 6);         // version needed
  buf.writeUInt16LE(0, 8);          // flags
  buf.writeUInt16LE(0, 10);         // compression
  buf.writeUInt16LE(0, 12);         // mod time
  buf.writeUInt16LE(0, 14);         // mod date
  buf.writeUInt32LE(crc32(data), 16);
  buf.writeUInt32LE(data.length, 20); // compressed
  buf.writeUInt32LE(data.length, 24); // uncompressed
  buf.writeUInt16LE(name.length, 28);
  buf.writeUInt16LE(0, 30);          // extra len
  buf.writeUInt16LE(0, 32);          // comment len
  buf.writeUInt16LE(0, 34);          // disk number start
  buf.writeUInt16LE(0, 36);          // internal attrs
  buf.writeUInt32LE(0, 38);          // external attrs
  buf.writeUInt32LE(localHeaderOffset, 42);
  name.copy(buf, 46);
  return buf;
}

function buildEndOfCentralDir(
  entryCount: number,
  cdSize: number,
  cdOffset: number,
): Buffer {
  const buf = Buffer.alloc(22);
  buf.writeUInt32LE(0x06054b50, 0);
  buf.writeUInt16LE(0, 4);                 // disk number
  buf.writeUInt16LE(0, 6);                 // disk with cd
  buf.writeUInt16LE(entryCount, 8);        // entries on disk
  buf.writeUInt16LE(entryCount, 10);       // total entries
  buf.writeUInt32LE(cdSize, 12);           // cd size
  buf.writeUInt32LE(cdOffset, 16);         // cd offset
  buf.writeUInt16LE(0, 20);               // comment length
  return buf;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
