


export class CreateTodoDto {

  // El constructor de la clase CreateTodoDto solo podra ser llamado desde la misma clase o algun metodo de la misma clase CreateTodoDto
  private constructor(
    public readonly text: string,
  ){}

  
  // Metodo estatico de la clase 
  // Este metodo retorna un array de dos elementos. El primero es de tipo string opcional (que sea opcional significa que dicho primer elemento tambien podra ser undefined). El segundo elemento es de tipo CreateTodoDto.
  // El parametro props del metodo create será un objeto que luce asi: cada una de sus propiedades (key) será de tipo string y el valor de cada una de las propiedades puede ser de cualquier tipo (any)
  static create(props: {[key:string]: any}): [string?, CreateTodoDto?] {
    
    const {text} = props;

    if(!text || text.length === 0) return ['Text property is required', undefined];

    return [undefined, new CreateTodoDto(text)];

  }


}
