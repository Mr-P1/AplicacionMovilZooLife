export interface Usuario {
  id: string;
  nombre:string,
  email:string,
  telefono:string,
  tipo:string,
  puntos:number,
  nivel:number,
  patente?:string,
  auth_id:string,
}


export type CrearUsuario = Omit<Usuario, 'id'>
