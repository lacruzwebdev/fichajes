import { createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e, utils) {
    // You can access these properties inside the `utils` object.
    const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;

    // Log to console.
    console.error("Action error:", e.message);

    // Return error message
    if (e instanceof ActionError) {
      return e.message;
    }

    return "Something went wrong. Please try again.";
  },
});
