export const recomendations = {
  // FACTURACION
  invoicing:
    "Te recomendamos nuestro servicio de facturación, es completamente gratis ¿Eres persona fisica o moral?",

  // DECLARACION MENSUAL
  subscripton:
    "Te recomendamos nuestro servicio de declaración mensual, ¿qué actividades realizas?",

  // DECLARACION ANUAL
  annual:
    "Te recomendamos nuestro servicio de declaración anual, ¿qué actividades realizas?",

  // DECLARACIONES ATRASADAS
  regularizations:
    "Te recomendamos nuestro servicio de declaración atrasada, ¿qué actividades realizas?",

  // CONSTANCIA DE SITUACIÓN FISCAL
  csf: "Te recomendamos nuestro servicio de constancia de situación fiscal, ¿qué actividades realizas?",

  // AYUDA CON EL SAT
  asat: "Te recomendamos nuestro servicio de ayuda con el sat, ¿Requieres alguno de estos tramites 'Cambio de regimen', 'sellos', 'efirma', 'cambio de domicilio', 'otro'? ",
};

export const welcomePrompt = () => {
  return `
  EJECUTA LA FUNCION REQUERIDA, SI NO HAY NINGUNA FUNCION QUE LO SOLUCIONE EJECUTA LA FUNCION ERROR.

  USER intent: \n
  `;
};
