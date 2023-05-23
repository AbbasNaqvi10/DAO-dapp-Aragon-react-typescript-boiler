import { ContextPlugin, MultisigClient } from "@aragon/sdk-client";
import { context } from "../config/argonClientConfig";

export const multisignClient = () => {
  
  // Create a plugin context from the Aragon OSx SDK context.
  const contextPlugin: ContextPlugin = ContextPlugin.fromContext(context);

  // Creates a Multisig plugin client.
  const multisigClient: MultisigClient = new MultisigClient(contextPlugin);
  return console.log(multisigClient);
};
