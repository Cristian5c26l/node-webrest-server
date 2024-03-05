import express, { Router } from 'express';
import compression from 'compression';
import path from 'path';

interface Options {
  port: number;
  public_path?: string;
  routes: Router;
}

export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;// Una vez asignado algo a port, ya no se podrá cambiar el contenido de port o reasignarle algo. Esto es posible gracias a readonly
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {// options es un objeto que deberá contener una propiedad llamada port la cual almacene un tipo de dato number y tendrá una propiedad OPCIONAL (?) llamada public_path la cual almacene una cadena o string 
    const { port, public_path = 'public', routes } = options;// En caso de que optiones no venga con la propiedad public_path, que se cree la variable public_path y asignarle "public"

    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
    
  }

  async start() {

    // console.log('Server running');
    
    // Middlewares
    this.app.use( express.json() );// Cualquier peticion que pase por el servidor montado en el puerto 3000 pasará por este middleware. Si el body de la peticion contiene un JSON, lo cual significaria que el body es de tipo raw porque el body se supone que contiene el JSON no codificado, entonces el JSON se convertirá a un objeto literal el cual será accesible desde req.body. Con este middleware, se consigue que si una peticion (req) POST a una ruta que exista en AppRouter (router,ts) se le envia como body un JSON ( y el body es de tipo raw, por tanto el body podria ser un JSON o text), entonces, la peticion (req) ya tendrá el body (req.body) como un objeto literal a nivel de codigo. Dicho objeto corrersponderá al JSON que esta en el body de la peticion POST a dicha ruta

    this.app.use( express.urlencoded({extended: true}) );// Cualquier peticion que pase por el servidor montado en el puerto 3000 pasará por este middleware. Si el body de la peticion contiene pares de clave valor, lo que significaria que el body es de tipo  x-www-form-urlencoded, entonces estos pares de clave valor seran accesibles desde req.body. Cuando se utiliza express.urlencoded({ extended: true }), Express analizará los datos del cuerpo (body) de la solicitud (peticion o req) codificados en formato x-www-form-urlencoded y los convertirá en un objeto JavaScript. Este objeto contendrá pares de claves y valores que representan los datos enviados desde el cliente.
    // Ejemplo donde el body es de tipo x-www-form-urlencoded:
    // Supongamos que se tiene el formulario siguiente:
    //
    // <form method="POST" action="/submit">
      //   <input type="text" name="username" />
      //   <input type="password" name="password" />
      //   <button type="submit">Enviar</button>
      // </form>
    // Cuando este formulario se envía, los datos se enviarán al servidor en el formato application/x-www-form-urlencoded. Entonces, si tienes this.app.use(express.urlencoded()) configurado, Express analizará automáticamente estos datos y los hará accesibles en req.body 
    
    this.app.use( compression() );

    // Public Folder
    this.app.use( express.static( this.publicPath ) );// Mostrar aplicacion web cargada desde index.html cuando el usuario va a localhost:3000/ (ruta /)
    
    // NOTE: ROUTES (RESTFul API) 
    this.app.use( this.routes );
        

    // NOTE: SPA (REACT APP located at ./public)
    this.app.get('*', (req, res) => {// Captura peticiones diferentes a localhost:3000/ y a las rutas contenidas por AppRoutes.routes en router.ts 

      // console.log(req.url);
      
      // res.send('Hola mundo');


      const indexPath = path.join( __dirname + `../../../${this.publicPath}/index.html` );// __dirname contiene el path absoluto del archivo actual (server.ts). Con path.join, construimos un nuevo path absoluto del archivo index.html contenido en la carpeta public tomando __dirname y '../../../public/index.html'
      res.sendFile( indexPath );

    });// Captura rutas diferentes a / (rutas como /search, /about, etc. (localhost:3000/search, etc))


    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
      
    });

  }

  public close() {
    this.serverListener?.close();
  }

}
