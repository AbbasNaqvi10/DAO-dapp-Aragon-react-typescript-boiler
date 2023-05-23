import { Client } from "@aragon/sdk-client";
import { context } from "src/config/argonClientConfig";

export const client: Client = new Client(context);