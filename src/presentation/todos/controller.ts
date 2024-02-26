import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";

export class TodosController {
  
  // Inyeccion de Dependencias (DI)
  constructor(
    private readonly todoRepository: TodoRepository// Puedo enviar TodoRepositoryImpl, pero eso obligaria a que sea esa implementacion. Enviando TodoRepository, yo puedo enviar cualquier repositorio o instancia que extienda de TodoRepository
  ){}

  public getTodos = (req: Request, res: Response) => {// req y res son de express. request y response siempre existiran en html.
    
    // const todos = await this.todoRepository.getAll();
    // return res.json(todos);

    new GetTodos( this.todoRepository )
      .execute()
      .then(todos => res.json( todos ))
      .catch(error => res.status(400).json({error}));

  }

  public getTodoById = (req: Request, res: Response) => {
    
    // Obtener el numero (numero 1) o id almacenado en el parametro "id" de la ruta /api/todos/1 (/api/todos/:id) 
    const id = +req.params.id;// Por defecto, el parametro id almacenará el numero en string. Con +, se convierte el numero que está en string a numero entero.
    
    new GetTodo( this.todoRepository )
      .execute(id)
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({error}));
    
  }

  public createTodo = (req: Request, res: Response) => {
    // const body = req.body;

    // console.log(body);
    
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    // Si text es undefined
    if( error ) return res.status(400).json({error: error});

    new CreateTodo( this.todoRepository )
      .execute( createTodoDto! )
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({error}));

  }

  public updateTodo = (req: Request, res: Response) => {
    
    const id = +req.params.id;
    
    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id// el id que viene en la url sustituye al id que viene en el body de la peticion
    });

    if (error) return res.status(400).json({error});// 400 es bad request

    new UpdateTodo( this.todoRepository )
      .execute( updateTodoDto! )
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({error}));

  }

  public deleteTodo = (req: Request, res: Response) => {

    
    const id = +req.params.id;

    
    new DeleteTodo( this.todoRepository )
      .execute( id )
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({error}));

  }

}
