
import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

export class TodosController {
  
  // Inyeccion de Dependencias (DI)
  constructor(
    private readonly todoRepository: TodoRepository// Puedo enviar TodoRepositoryImpl, pero eso obligaria a que sea esa implementacion. Enviando TodoRepository, yo puedo enviar cualquier repositorio o instancia que extienda de TodoRepository
  ){}

  public getTodos = async(req: Request, res: Response) => {// req y res son de express. request y response siempre existiran en html.
    
    const todos = await this.todoRepository.getAll();
    return res.json(todos);

  }

  public getTodoById = async(req: Request, res: Response) => {
    
    // Obtener el numero (numero 1) o id almacenado en el parametro "id" de la ruta /api/todos/1 (/api/todos/:id) 
    const id = +req.params.id;// Por defecto, el parametro id almacenará el numero en string. Con +, se convierte el numero que está en string a numero entero.

    try {
      const todo = await this.todoRepository.findById( id );
      res.json(todo);
    } catch (error) {
      res.status(400).json({error});// 400 es de bad request
    } 

  }

  public createTodo = async(req: Request, res: Response) => {
    // const body = req.body;

    // console.log(body);
    
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    // Si text es undefined
    if( error ) return res.status(400).json({error: error});

    // Grabar un todo en la tabla todo de la base de datos TODO a la que nos conectamos con POSTGRES_URL (en archivo .env viene)
    const todo = await this.todoRepository.create( createTodoDto! ); 


    res.json( todo );
  }

  public updateTodo = async(req: Request, res: Response) => {
    
    const id = +req.params.id;
    
    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id// el id que viene en la url sustituye al id que viene en el body de la peticion
    });

    if (error) return res.status(400).json({error});// 400 es bad request

    //const todo = todos[0];// todo tendra la referencia al objeto que esta en la posicion 0 del array todos. Por tanto, si cambio el valor de la propiedad text del objeto contenido en todo, automaticamente, el objeto en la posicion 0 del array tambien se le modificará el valor de la propiedad text.
    // const todo = todos.find(todo => todo.id === id);

    const todoUpdated = await this.todoRepository.updateById( updateTodoDto! );

    return res.json( todoUpdated );


  }

  public deleteTodo = async(req: Request, res: Response) => {

    
    const id = +req.params.id;

    const todoDeleted = await this.todoRepository.deleteById(id);

    res.json(todoDeleted);
    

  }

}
