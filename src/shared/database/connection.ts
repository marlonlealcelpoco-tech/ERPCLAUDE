// Conexão com o banco LOCAL da filial (PDV funciona offline).
// TODO: trocar pelo driver real (ex: better-sqlite3, postgres local, etc).

let localDb: unknown = null;

export function getLocalDb() {
  if (!localDb) {
    // TODO: inicializar conexão real com o banco local da filial
    localDb = {};
  }
  return localDb;
}

export function getCentralDb() {
  // TODO: conexão com o banco central (usada só pelo processo de sincronização
  // e por relatórios multi-loja), nunca diretamente pelo PDV.
  throw new Error("getCentralDb: implementar conexão com o banco central");
}
