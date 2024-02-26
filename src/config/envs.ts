import 'dotenv/config';// Esta instruccion carga mis variables de entorno acorde al archivo .env.
import { get } from 'env-var';


export const envs = {

  
  PORT: get('PORT').required().asPortNumber(),
  PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString()

}
