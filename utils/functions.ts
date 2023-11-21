import { recomendations } from "./prompts";

const descriptionActivities = (description: string) => {
  return `
      ${description}
      User say
      "Uber, Rappi, Didi, Mercado libre, vendo en linea" is equal to "platforms"
      "Trabajo en una empresa" is equal to "salaried"
      "Tengo una empresa" is equal to "enterprise"
      "Soy independiente, freelance" is equal to "resico"
      "taquero" is equal to "sandungueo"

      RULE: CAN BE MORE THAN ONE.
    `;
};

// ======================== RECOMENDATIONS ==========================

export const recomendationsFunctions = [
  {
    name: "get_current_weather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
        },
      },
      required: ["location"],
    },
  },
  {
    name: "regularization",
    description: `
          RECOMMENDATION: ${recomendations.regularizations}.
          `,
    parameters: {
      type: "object",
      properties: {
        activities: {
          type: "string",
          description: descriptionActivities(""),
          enum: ["enterprise", "resico", "platforms", "salaried"],
        },
      },
      required: ["activities"],
    },
  },
  {
    name: "subscription",
    description: `
          RECOMMENDATION: ${recomendations.subscripton}.
          `,
    parameters: {
      type: "object",
      properties: {
        activities: {
          type: "string",
          description: descriptionActivities(""),
          enum: ["enterprise", "resico", "platforms", "salaried"],
        },
      },
      required: ["activities"],
    },
  },
  {
    name: "annual",
    description: `
          RECOMMENDATION: ${recomendations.annual}.
          `,
    parameters: {
      type: "object",
      properties: {
        activities: {
          type: "string",
          description: descriptionActivities(""),
          enum: ["enterprise", "resico", "platforms", "salaried"],
        },
      },
      required: ["activities"],
    },
  },
  {
    name: "invoicing",
    description: `
          RECOMMENDATION: ${recomendations.invoicing}.
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "csf",
    description: `
          RECOMMENDATION: ${recomendations.csf}.
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "asat",
    description: `
          RECOMMENDATION: ${recomendations.asat}.
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
          OR YOU CANT FIND THE USER INTENT. or say: "hola", "gracias", "no entendi"
          `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];
