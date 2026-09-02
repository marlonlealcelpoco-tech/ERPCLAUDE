import path from "path";
import fs from "fs";
import { LocalDatabase } from "./connection";

export class JsonDiskDatabase implements LocalDatabase {
  private filePath: string;
  private data: Record<string, Record<string, any>> = {};

  constructor(filePath?: string) {
    this.filePath = filePath || process.env.DATABASE_FILE_JSON || path.join(process.cwd(), "database_store.json");
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        this.data = JSON.parse(raw) || {};
      } else {
        this.data = {};
        this.saveToDisk();
      }
    } catch {
      this.data = {};
    }
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[JsonDiskDatabase] Erro ao gravar banco JSON em disco:", err);
    }
  }

  private getTable(tableName: string): Record<string, any> {
    if (!this.data[tableName]) {
      this.data[tableName] = {};
    }
    return this.data[tableName];
  }

  insert<T extends { id: string }>(tableName: string, record: T): T {
    const table = this.getTable(tableName);
    table[record.id] = record;
    this.saveToDisk();
    return record;
  }

  update<T extends { id: string }>(tableName: string, id: string, partialRecord: Partial<T>): T {
    const table = this.getTable(tableName);
    const existing = table[id];
    if (!existing) {
      throw new Error(`Registro com id ${id} não encontrado na tabela ${tableName}`);
    }
    const updated = { ...existing, ...partialRecord, id };
    table[id] = updated;
    this.saveToDisk();
    return updated as T;
  }

  findById<T>(tableName: string, id: string): T | null {
    const table = this.getTable(tableName);
    const item = table[id];
    return item ? (item as T) : null;
  }

  find<T>(tableName: string, predicate?: (item: T) => boolean): T[] {
    const table = this.getTable(tableName);
    const all = Object.values(table) as T[];
    return predicate ? all.filter(predicate) : all;
  }

  delete(tableName: string, id: string): boolean {
    const table = this.getTable(tableName);
    if (table[id]) {
      delete table[id];
      this.saveToDisk();
      return true;
    }
    return false;
  }

  clear(): void {
    this.data = {};
    this.saveToDisk();
  }
}
