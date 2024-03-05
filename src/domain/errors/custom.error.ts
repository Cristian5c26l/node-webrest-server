


export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ){
    super( message );// Esto es como hacer Error(message). El constructor de la clase Error recibe un string. super hace referencia al constructor de la clase Error, que es la clase padre de CustomError
  }
}
