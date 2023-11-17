export const functions = [
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
        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
      },
      required: ["location"],
    },
  },
  {
    name: "get_plans",
    description: `
        RULES: THE USER MUST SAY 'PLAN' OR 'PLANES' OR THE FUNCTION MUST NOT BE CALLED.
        Get a list of plans, usefull for users who ask for plans, contract a plan.
        EXAMPLES: 'Quiero contratar un plan.', 'Quiero un plan.'
        `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];
