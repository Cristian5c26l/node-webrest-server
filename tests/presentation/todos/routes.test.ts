import { prisma } from "../../../src/data/postgres";
import { testServer } from "../../test-server";
import request from 'supertest';

describe('Todo route testing', () => {

  // Antes de TODAS las pruebas
  beforeAll(async() => {
    // Levantar el servidor para poner en escucha de peticiones el puerto PORT
    await testServer.start();
  });

  // Despues de TODAS las pruebas (que se hayan terminado todas)
  afterAll(() => {
    // Cerrar la escucha de peticiones por el puerto PORT
    testServer.close();
  });

  // Antes de cada prueba 
  beforeEach(async() => {
    // Vaciar o eliminar todos los registros de la tabla todo de la base de datos directamente
    await prisma.todo.deleteMany();

  });

  const todo1 = { text: 'Todo 1' };
  const todo2 = { text: 'Todo 2' };

  test('should return TODOS api/todos', async() => {
    
        
    // Añadir dos todos directamente a la base de datos
    await prisma.todo.createMany({
      data: [ todo1, todo2 ]
    });

    
    // Hacer una peticion GET a /api/todos (supertest me permite hacer esto. Como s)
    const { body } = await request( testServer.app )
      .get('/api/todos')
      .expect(200)
     
    
    //console.log(response.body);
    
    expect( body ).toBeInstanceOf( Array );
    expect( body.length ).toBe(2);
    expect( body[0].text ).toBe(todo1.text);
    expect( body[1].text ).toBe(todo2.text);
    expect( body[0].completedAt ).toBeUndefined();
    expect( body[1].completedAt ).toBeUndefined();


  });

  test('should return a TODO /api/todos/:id', async() => {
    const todo = await prisma.todo.create({
      data: todo1
    });
    
    const { body } = await request( testServer.app )
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: undefined
    });

  });

  test('should return a 404 NotFound /api/todos/:id', async() => {
    const todoId = 999;
    const { body } = await request( testServer.app )
      .get(`/api/todos/${ todoId }`)
      .expect( 404 );

    expect( body ).toEqual({ error: `Todo with id ${ todoId } not found` });
  });


  test('should return a new Todo /api/todos', async() => {

    const { body } = await request( testServer.app )
      .post('/api/todos')
      .send( todo1 )
      .expect(201);

    // console.log({body});

    expect( body ).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: undefined // Propiedad undefined no viene en la respuesta (body es la respuesta que es el todo respondido)
    });

  });


  test('should return an error if text is not present /api/todos', async() => {

    const { body } = await request( testServer.app )
      .post('/api/todos')
      .send({  })
      .expect(400);

    // console.log({body});


    expect( body ).toEqual({
      error: 'Text property is required'
    });

   
  });

   test('should return an error if text is empty /api/todos', async() => {

    const { body } = await request( testServer.app )
      .post('/api/todos')
      .send({ text: '' })
      .expect(400);

    // console.log({body});


    expect( body ).toEqual({
      error: 'Text property is required'
    });

   
  });

  
  test('should return an updated TODO /api/todos/:id', async() => {

    const todo = await prisma.todo.create({data: todo1});

    const { body } = await request( testServer.app )
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'Holaa UPDATED', completedAt: '2023-10-21' })
      .expect(200);

    expect( body ).toEqual({
      id: expect.any(Number),
      text: 'Holaa UPDATED',
      completedAt: '2023-10-21T00:00:00.000Z'
    });

  });

  // TODO: realizar la operacion con errores personalizados
  test('should return 404 if TODO not found', async() => {
   
    // Actualizar un id que sabemos que no existe en la tabla todo de la base de datos (previamente la tabla todo se vacia)
    const {body} = await request( testServer.app )
      .put(`/api/todos/1`)
      .send({ text: 'Holaa UPDATED', completedAt: '2023-10-21' })
      .expect(404);
    
    expect(body).toEqual({
      error: `Todo with id 1 not found`
    });

  });

  test('should return an updated TODO only the date', async() => {
    
    const todo = await prisma.todo.create({data: todo1});// todo es el creado o agregado en la tabla todo de la base de datos

    const { body } = await request( testServer.app )
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: '2023-10-21' })
      .expect(200);

    expect( body ).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: '2023-10-21T00:00:00.000Z'
    });

  });

  test('should delete a TODO /api/todos/:id', async() => {
    
    const todo = await prisma.todo.create({data: todo1});// todo es el creado o agregado en la tabla todo de la base de datos
    
    const { body } = await request( testServer.app )
      .delete(`/api/todos/${todo.id}`)
      .expect(200)

    expect(body).toEqual({
      id: todo.id, // expect.any(Number)
      text: todo1.text,
      completedAt: undefined
    });
  });

  // TODO: Cambiar a 404
  test('should return 404 if todo do not exist /api/todos/:id', async() => {
    const { body } = await request( testServer.app )
      .delete(`/api/todos/1`)
      .expect(404)

    // console.log({body});
    
    expect( body ).toEqual({
      error: `Todo with id 1 not found`
    });

  });

})
