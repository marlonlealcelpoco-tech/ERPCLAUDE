// Erros padronizados da aplicação. Todo módulo deve lançar esses erros
// em vez de erros genéricos, para que o middleware central de erro
// (error-handler.ts) responda com o status HTTP correto.

export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number = 400) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Registro não encontrado") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso não permitido para este perfil") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos") {
    super(message, 422);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Operação em conflito com o estado atual") {
    super(message, 409);
  }
}
