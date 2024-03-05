import { envs } from "../src/config/envs";
import { Server } from "../src/presentation/server";// Importar clase Server del archivo server.ts localizado en src/presentation

jest.mock('../src/presentation/server');// Que la clase Server exportada (e importada desde este archivo) del archivo server.ts localizado en src/presentation sea mockeada (se mockea la clase Server con jest.mock) 

describe('should call server with arguments and start', () => {

  test('should work', async() => {
    
    // Estimulacion
    await import('../src/app');// Ejecutar el archivo app.ts el cual desde su metodo main va mandar a llamar la funcion main para llamar o usar la clase Server 

    // Aserciones 
    expect( Server ).toHaveBeenCalledTimes(1);// Probar que clase Server se haya llamado o usado una vez
    expect( Server ).toHaveBeenCalledWith({// Probar que se hayan llamado con tales argumentos de forma general
      port: envs.PORT,
      public_path: envs.PUBLIC_PATH,
      routes: expect.any(Function)
    });
    expect( Server.prototype.start ).toHaveBeenCalledTimes(1);// Probar que el metodo start de la clase Server haya sido llamado una vez
    expect( Server.prototype.start ).toHaveBeenCalledWith();// Probar que el metodo start haya sido llamado sin ningun argumento
  });

});
