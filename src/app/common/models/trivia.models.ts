export interface PreguntaTrivia {
  animal_id: string;
  pregunta: string;
  respuesta_correcta: string;
  respuestas: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  tipo: string;
}
