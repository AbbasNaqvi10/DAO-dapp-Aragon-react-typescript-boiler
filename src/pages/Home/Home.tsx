import React, { useState } from "react";
import { Button, Container } from "@mui/material";

import { createDAO } from "src/utils/createDAO";
import { createProposalWithAction } from "src/utils/createProposalWithAction";

import { useAragon } from "src/context/AragonProvider";

const Home: React.FC = () => {
  const { context, baseClient } = useAragon();
  const [dao, setDao] = useState<{ address: string | undefined; plugin: Array<string> | undefined }>({
    address: "",
    plugin: [],
  });
  const [proposalId, setProposalId] = useState([]);

  const createDAOHandler = async () => {
    if (baseClient) {
      const { daoAddress, pluginAddresses } = await createDAO(baseClient);
      setDao({ address: daoAddress, plugin: pluginAddresses });
      console.log("daoAddress", dao.address);
      console.log("pluginAddresses", dao.plugin);
    }
  };
  const createProposalHandler = async () => {
    if (baseClient && context && dao.plugin) {
      console.log("daoAddress", dao.address);
      console.log("pluginAddresses", dao.plugin);
      await createProposalWithAction(context, dao.plugin);
      // setProposalId(proposalId => [...proposalId, await createProposalWithAction(context, dao.plugin)]);
    }
  };

  return (
    <Container maxWidth="xl">
      <h1>Create DAO</h1>
      <Button disabled={!baseClient} variant="contained" sx={{ mr: 2 }} onClick={createDAOHandler}>
        Create DAO
      </Button>
      <Button disabled={!baseClient} variant="contained" sx={{ mr: 2 }} onClick={createProposalHandler}>
        Create Proposal
      </Button>
    </Container>
  );
};

export default Home;

