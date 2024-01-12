const descriptionActivities = (description?: string) => {
  return `
      ${description}
      User say
      "Uber, Rappi, Didi, Mercado libre, vendo en linea" is equal to "platforms"
      "Trabajo en una empresa" is equal to "salaried"
      "Tengo una empresa" is equal to "enterprise"
      "Soy independiente, freelance" is equal to "resico"
      "Soy arrendatario, rento un inmueble, rento una casa, rento un apartamento" is equal to "lease"

      RULE: In the event that it is detected that there may be more than one activity, the parameter is equal to "multiple"
    `;
};

const descriptionASAT = (description?: string) => {
  return `
      ${description}
      User say
      "Cambio de regimen" is equal to "basic"
      "Cambio de domicilio" is equal to "basic"
      "e firma" is equal to "complete"
      "sellos" is equal to "complete"
      "Darme de alta en " is equal to "complete"
      "otro" is equal to "complete"

      RULE: ANY OTHER ANSWER IS EQUAL TO "complete"
    `;
};

// ======================== RECOMENDATIONS ==========================

export const recomendationsFunctions = [
  {
    name: "get_asat_type",
    description: "Use when the recommended product is ASAT",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: descriptionASAT(),
          enum: ["complete", "basic"],
        },
      },
    },
  },
  {
    name: "get_activities",
    description: "Use when recommended product is one of this: regularizations, annual, subscription",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: descriptionActivities(),
          enum: ["platforms", "salaried", "enterprise", "resico", "lease"],
        },
      },
    },
  },
  {
    name: "error",
    description: `
          RULES: THE USER SAY SOMETHING THAT IS NOT IN THE LIST, OR IS IRRILEVANT TO THE LIST.
          OR YOU CANT FIND THE USER INTENT. or user only say: "hola", "gracias", "no entendi"
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

// ========================== WELCOME ==========================

export const welcomeFunctions = [
  {
    name: "error",
    description: `
          RULES: THE USER SAY SOMETHING THAT IS NOT IN THE LIST, OR IS IRRILEVANT TO THE LIST.
          OR YOU CANT FIND THE USER INTENT. or user only say: "hola", "gracias", "no entendi"
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "regularization",
    description: `
          User say: "declaraciones pendientes", "no he presentado mis impuestos", "meses pendientes", "declaraciones de años anteriores", "me quiero poner al corriente", "ponerme al dia", "declaraciones atrasadas".
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "subscription",
    description: `
          User say: "Quiero presentar mis impuestos mensuales", "Soy uber/rappi/didi", "Como puedo comenzar a pagar impuestos", "Quiero pagar menos impuestos", "certificado de retenciones", "presentar mis declaraciones", "Como se hace el tramite para pagar impuestos". "Ayuda o asesoría""
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "annual",
    description: `
         User say: "Anual", "Declaracion anual", "Quiero presentar mi declaración de este año", "Quiero presentar mi declaracion anual del año pasado", "declaraciones anuales atrasadas", "Ponerme al día con mi anual"
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "invoicing",
    description: `
          User say: "Facturar", "Se puede facturar", "es gratis facturar".
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "csf",
    description: `
          User say: "constancia", "situación fiscal", "documento del sat", "csf", "documentos".
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "asat",
    description: `
          User say: "ayuda con el sat", "tramite del sat", "efirma", "cambiar regimen", "cambiar domicilio", "sellos", 'rfc', "darme de alta en".
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];
