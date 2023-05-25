import React from "react";
import { Button, Container } from "@mui/material";

import { createDAO } from "src/utils/createDAO";

import { useAragon } from "src/context/AragonProvider";

const Home: React.FC = () => {
  const { baseClient } = useAragon();

  const createDAOHandler = async () => {
    if (baseClient) {
      const { daoAddress, pluginAddresses } = await createDAO(baseClient);
      console.log("daoAddress", daoAddress);
      console.log("pluginAddresses", pluginAddresses);
    }
  };

  return (
    <Container maxWidth="xl">
      <h1>Create DAO</h1>
      <Button disabled={!baseClient} variant="contained" sx={{ mr: 2 }} onClick={createDAOHandler}>
        Create DAO
      </Button>
    </Container>
  );
};

export default Home;

