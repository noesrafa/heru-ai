import { recomendations } from "./prompts";

const activities = ["enterprise", "resico", "platforms", "salaried"];

const descriptionActivities = (description?: string) => {
  return `
      ${description}
      User say
      "Uber, Rappi, Didi, Mercado libre, vendo en linea" is equal to "platforms"
      "Trabajo en una empresa" is equal to "salaried"
      "Tengo una empresa" is equal to "enterprise"
      "Soy independiente, freelance" is equal to "resico"

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
      "otro" is equal to "complete"

      RULE: ANY OTHER ANSWER IS EQUAL TO "complete"
    `;
};

// ======================== RECOMENDATIONS ==========================

export const recomendationsFunctions = [
  {
    name: "get_asat_type",
    description: "for asat give the type of service",
    parameters: {
      type: "object",
      properties: {
        asat_type: {
          type: "string",
          description: descriptionASAT(),
        },
        type: {
          type: "string",
          enum: ["complete", "basic"],
        },
      },
    },
  },
  {
    name: "get_activities",
    description: "for: regularizations, annual, subscription",
    parameters: {
      type: "object",
      properties: {
        activities: {
          type: "string",
          description: descriptionActivities(),
        },
        activity: {
          type: "string",
          enum: ["platforms", "salaried", "enterprise", "resico"],
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
          User say: "tengo declaraciones pendientes", "no he presentado mis impuestos", "meses pendientes", "declaraciones de años anteriores", "me quiero poner al corriente".
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "subscription",
    description: `
          User say: "Quiero presentar mis impuestos mensuales", "Soy uber/rappi/didi", "Como puedo comenzar a pagar impuestos", "Quiero pagar menos impuestos"."
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "annual",
    description: `
         User say: "Declaracion anual", "Quiero presentar mi declaración de este año", "Quiero presentar mi declaracion anual del año pasado", "declaraciones anuales atrasadas"
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
          User say: "constancia", "situación fiscal", "documento del sat", "csf".
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "asat",
    description: `
          User say: "ayuda con el sat", "tramite del sat", "efirma", "cambiar regimen", "cambiar domicilio"
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];
