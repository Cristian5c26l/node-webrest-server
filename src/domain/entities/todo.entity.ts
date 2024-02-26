


export class TodoEntity {

  constructor(
    public id: number,//obligatorio
    public text: string,// obligatorio
    public completedAt?: Date|null// opcional
  ){}

  get isCompleted() {
    return !!this.completedAt;
  }

  public static fromObject( object: {[key: string]: any} ): TodoEntity {
    const { id, text, completedAt } = object;

    if ( !id ) throw 'Id is required';
    if ( !text ) throw 'text is required';

    let newCompletedAt;

    if ( completedAt ) {
      newCompletedAt = new Date( completedAt );
      if ( isNaN( newCompletedAt.getTime() ) ) {// Si la fecha no es valida, arrojar error
        throw 'CompletedAt is not a valid date';
      }
    }

    return new TodoEntity(id, text, newCompletedAt);

  }

}
// Una instancia de la clase TodoEntity tendrá id, text, completedAt e isCompleted como atributos. La negacion a this.completedAt (!this.completedAt) devolverá false si this.completedAt tiene algo diferente a null o undefined. Si se niega este resultado, el resultado final será true
