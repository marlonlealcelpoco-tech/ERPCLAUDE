import { SqliteDatabase } from "./sqlite";

export interface LocalDatabase {
  tables?: Map<string, Map<string, any>>;
  insert<T extends { id: string }>(tableName: string, record: T): T;
  update<T extends { id: string }>(tableName: string, id: string, partialRecord: Partial<T>): T;
  findById<T>(tableName: string, id: string): T | null;
  find<T>(tableName: string, predicate?: (item: T) => boolean): T[];
  delete(tableName: string, id: string): boolean;
  clear(): void;
}

class InMemoryLocalDb implements LocalDatabase {
  public tables = new Map<string, Map<string, any>>();

  private getTable(tableName: string): Map<string, any> {
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, new Map<string, any>());
    }
    return this.tables.get(tableName)!;
  }

  insert<T extends { id: string }>(tableName: string, record: T): T {
    const table = this.getTable(tableName);
    table.set(record.id, record);
    return record;
  }

  update<T extends { id: string }>(tableName: string, id: string, partialRecord: Partial<T>): T {
    const table = this.getTable(tableName);
    const existing = table.get(id);
    if (!existing) {
      throw new Error(`Registro com id ${id} não encontrado na tabela ${tableName}`);
    }
    const updated = { ...existing, ...partialRecord, id };
    table.set(id, updated);
    return updated as T;
  }

  findById<T>(tableName: string, id: string): T | null {
    const table = this.getTable(tableName);
    const item = table.get(id);
    return item ? (item as T) : null;
  }

  find<T>(tableName: string, predicate?: (item: T) => boolean): T[] {
    const table = this.getTable(tableName);
    const all = Array.from(table.values()) as T[];
    return predicate ? all.filter(predicate) : all;
  }

  delete(tableName: string, id: string): boolean {
    const table = this.getTable(tableName);
    return table.delete(id);
  }

  clear(): void {
    this.tables.clear();
  }
}

let localDbInstance: LocalDatabase | null = null;

export function getLocalDb(): LocalDatabase {
  if (!localDbInstance) {
    if (process.env.USE_MEMDB === "true") {
      localDbInstance = new InMemoryLocalDb();
    } else {
      localDbInstance = new SqliteDatabase();
    }
  }
  return localDbInstance;
}

export function resetLocalDbForTesting(): void {
  if (localDbInstance) {
    localDbInstance.clear();
  }
}

export function getCentralDb(): LocalDatabase {
  return getLocalDb();
}
