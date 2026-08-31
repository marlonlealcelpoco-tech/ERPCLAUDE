import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export class SqliteDatabase {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const finalPath = dbPath || process.env.DATABASE_FILE || path.join(process.cwd(), "database.sqlite");
    const dir = path.dirname(finalPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new Database(finalPath);
    this.db.pragma("journal_mode = WAL");
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS store_data (
        table_name TEXT NOT NULL,
        id TEXT NOT NULL,
        data TEXT NOT NULL,
        PRIMARY KEY (table_name, id)
      );

      CREATE TABLE IF NOT EXISTS fila_sincronizacao (
        id TEXT PRIMARY KEY,
        tabela TEXT NOT NULL,
        operacao TEXT NOT NULL,
        payload TEXT NOT NULL,
        criadoEm TEXT NOT NULL,
        sincronizadoEm TEXT
      );
    `);
  }

  insert<T extends { id: string }>(tableName: string, record: T): T {
    const stmt = this.db.prepare(
      "INSERT OR REPLACE INTO store_data (table_name, id, data) VALUES (?, ?, ?)"
    );
    stmt.run(tableName, record.id, JSON.stringify(record));
    return record;
  }

  update<T extends { id: string }>(tableName: string, id: string, partialRecord: Partial<T>): T {
    const existing = this.findById<T>(tableName, id);
    if (!existing) {
      throw new Error(`Registro com id ${id} não encontrado na tabela ${tableName}`);
    }
    const updated = { ...existing, ...partialRecord, id };
    this.insert<T>(tableName, updated);
    return updated;
  }

  findById<T>(tableName: string, id: string): T | null {
    const stmt = this.db.prepare(
      "SELECT data FROM store_data WHERE table_name = ? AND id = ?"
    );
    const row = stmt.get(tableName, id) as { data: string } | undefined;
    if (!row) return null;
    return JSON.parse(row.data) as T;
  }

  find<T>(tableName: string, predicate?: (item: T) => boolean): T[] {
    const stmt = this.db.prepare("SELECT data FROM store_data WHERE table_name = ?");
    const rows = stmt.all(tableName) as { data: string }[];
    const all = rows.map((r) => JSON.parse(r.data) as T);
    return predicate ? all.filter(predicate) : all;
  }

  delete(tableName: string, id: string): boolean {
    const stmt = this.db.prepare("DELETE FROM store_data WHERE table_name = ? AND id = ?");
    const res = stmt.run(tableName, id);
    return res.changes > 0;
  }

  clear(): void {
    this.db.prepare("DELETE FROM store_data").run();
    this.db.prepare("DELETE FROM fila_sincronizacao").run();
  }

  getRawDb(): Database.Database {
    return this.db;
  }
}
