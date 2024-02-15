
// console.log("Hola mundo!!");// 
import fs from 'fs';
import http from 'http';

// Crear servidor web (por el protocolo http, servir archivos via navegadores web)

const server = http.createServer((req, res) => {
  // req: request (lo que se solicita)
  // res: response
  
  // req.url: Url solicitada por el usuario
  console.log(req.url);// Puede imprimir /css/styles.css o /src/app.js o /

  // Tipo de respuesta texto plano
  // res.write('Hola Mundo');
  // res.end();
  
  // Tipo de respuesta HTML 
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write('<h1>Hola mundo</h1>');
  // res.end();
  
  // Tipo de respuesta JSON
  // const data = { name: 'John Doe', age: 30, city: 'New York' };
  // res.writeHead(200, {'Content-Type': 'application/json'});
  // res.end(JSON.stringify(data));// esto es lo mismo que res.write(JSON.stringify(data)); y res.end();
  
  if ( req.url === '/' ) {
    const contentHtmlFile = fs.readFileSync('./public/index.html', 'utf-8');// parece que readFileSync toma en cuenta la referencia o ruta absoluta del directorio que contiene la carpeta src
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end( contentHtmlFile );

    return;

  } 
 
  if ( req.url?.endsWith('.css') ) {

    
    res.writeHead(200, {'Content-Type': 'text/css'});

  } else if( req.url?.endsWith('.js') ) {


    // console.log('APP JS');
    

    res.writeHead(200, {'Content-Type': 'application/javascript'});

  } 

  res.end( fs.readFileSync(`./public${req.url}`) );

});

// Montarlo o levantarlo.
server.listen(8080, () => {
  console.log('Server running on port 8080');
  
});

// De la anterior manera, hemos abierto el puerto 8080 de mi PC (localhost) 

