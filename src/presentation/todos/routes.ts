import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository.impl";



export class TodoRoutes {

  // Subrutas de la ruta general /api/todos
  static get routes(): Router {// routes es una propiedad de la clase AppRoutes porque es un getter (get)
    
    const router = Router(); 

    const datasource = new TodoDatasourceImpl();// datasource en este caso es el de postgres. En caso de querer cambiar el datasource, simplemente, se cambia desde aqui
    const todoRepository = new TodoRepositoryImpl( datasource );

    const todoController = new TodosController( todoRepository ); 
    
    // /api/todos o /api/todos/
    router.get('/', todoController.getTodos);// Recordar que en realidad el callback esta implicito. (req, res) => todoController.getTodos(req, res) es equivalente a todoController.getTodos
    
    // /api/todos/numeroEntero. Ejemplo: /api/todos/1
    router.get('/:id', todoController.getTodoById);

    // POST a /api/todos o a /api/todos 
    router.post('/', todoController.createTodo);

    // PUT a /api/todos/:id. Ejemplo: /api/todos/1.
    router.put('/:id', todoController.updateTodo);

    // DELETE a /api/todos/:id. Ejemplo: /api/todos/1.
    router.delete('/:id', todoController.deleteTodo);

    return router;

  }

}

