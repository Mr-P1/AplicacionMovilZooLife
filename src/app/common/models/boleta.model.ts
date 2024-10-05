export interface Boleta{
  id:string,
  tipo?:string
}


export interface BoletaUsada{
  id:string,
  tipo?:string,
  fecha:string,
  id_usuario:string,
}




export type CrearBoletaUsada = Omit<BoletaUsada,'id'>;
