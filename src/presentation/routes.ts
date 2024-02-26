import { Router } from 'express';
import { TodoRoutes } from './todos/routes';



export class AppRoutes {

  // Rutas generales
  static get routes(): Router {// routes es una propiedad de la clase AppRoutes porque es un getter (get)
    
    const router = Router(); 

    router.use('/api/todos', TodoRoutes.routes);// Usamos "use" porque la funcion estatica routes se va a ejecutar cuando se haga una peticion a /api/todos

    return router;

  }

}




