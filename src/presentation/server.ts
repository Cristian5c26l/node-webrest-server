import express from 'express';
import path from 'path';

interface Options {
  port: number;
  public_path?: string;
}

export class Server {

  private app = express();
  private readonly port: number;// Una vez asignado algo a port, ya no se podrá cambiar el contenido de port o reasignarle algo. Esto es posible gracias a readonly
  private readonly publicPath: string;

  constructor(options: Options) {// options es un objeto que deberá contener una propiedad llamada port la cual almacene un tipo de dato number y tendrá una propiedad OPCIONAL (?) llamada public_path la cual almacene una cadena o string 
    const { port, public_path = 'public' } = options;// En caso de que optiones no venga con la propiedad public_path, que se cree la variable public_path y asignarle "public"

    this.port = port;
    this.publicPath = public_path;
    
  }

  async start() {

    // console.log('Server running');
    
    // Middlewares

    // Public Folder
    this.app.use( express.static( this.publicPath ) );// Mostrar aplicacion web cargada desde index.html cuando el usuario va a localhost:3000/ (ruta /)

    
    this.app.get('*', (req, res) => {// Captura peticiones diferentes a localhost:3000/

      // console.log(req.url);
      
      // res.send('Hola mundo');


      const indexPath = path.join( __dirname + `../../../${this.publicPath}/index.html` );// __dirname contiene el path absoluto del archivo actual (server.ts). Con path.join, construimos un nuevo path absoluto del archivo index.html contenido en la carpeta public tomando __dirname y '../../../public/index.html'
      res.sendFile( indexPath );

    });// Captura rutas diferentes a / (rutas como /search, /about, etc. (localhost:3000/search, etc))


    this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
      
    });

  }

}
