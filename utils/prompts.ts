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
  asat: "Te recomendamos nuestro servicio de ayuda con el sat, ¿Requieres alguno de estos tramites 'Cambio de regimen', 'sellos', 'efirma', 'otro'? ",
};

export const welcomePrompt = () => {
  return `
  Debes recomendar el servicio de acuerdo a las reglas:
  NO HAGAS PREGUNTAS, NUNCA MENCIONES AL SAT Y RECOMIENDA EL SERVICIO DE ACUERDO A LAS REGLAS:
  
  SERVICIO: FACTURACIÓN
  REGLAS: el usuario menciono: "factura", "quiero facturar"
  RECOMENDACION: ${recomendations.invoicing}

  SERVICIO: DECLARACION MENSUAL
  REGLAS: el usuario menciono: "declaración", "mensual", "presentar mis impuestos", "pagar menos"
  RECOMENDACION: ${recomendations.subscripton}

  SERVICIO: DECLARACIÓN ANUAL
  REGLAS: el usuario menciono: "declaración", "anual", "presentar mi anual", "mi declaracion de 2023"
  RECOMENDACION: ${recomendations.annual}

  SERVICIO: DECLARACIONES ATRASADAS
  REGLAS: el usuario menciono: "declaración", "atrasada", "presentar mis impuestos atrasados", "Quiero estar al dia", "no he presentado mis impuestos", "meses pendientes" 
  RECOMENDACION: ${recomendations.regularizations}

  SERVICIO: CONSTANCIA DE SITUACIÓN FISCAL
  REGLAS: el usuario menciono: "constancia", "situación fiscal"
  RECOMENDACION: ${recomendations.csf}

  SERVICIO: AYUDA CON EL SAT
  REGLAS: el usuario menciono: "ayuda", "sat", "ayuda con un tramite", "sacar mi e.firma", "cambiar de regimen", "sacar rfc", "no tengo RFC"
  RECOMENDACION: ${recomendations.asat}

  SI NO TIENE NADA QUE VER CON ESTO O NO SE ENCUENTRA EL SERVICIO EN LA LISTA EJECUTA LA FUNCIÓN ERROR.

  USER intent: \n
  `;
};
