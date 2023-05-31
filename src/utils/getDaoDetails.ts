import { Client, Context, DaoDetails } from "@aragon/sdk-client";

export const getDaoDetails = async (context: Context, address: string) => {
  // Instantiate the general purpose client from the Aragon OSx SDK context.
  const client: Client = new Client(context);
  // Get a DAO's details.
  const dao: DaoDetails | null = await client.methods.getDao(address);
  console.log(dao);
  return dao;
};
