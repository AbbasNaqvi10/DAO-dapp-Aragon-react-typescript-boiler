import React, { useState } from "react";
import { Button, Container } from "@mui/material";

import { createDAO } from "src/utils/createDAO";
import { createProposalWithAction } from "src/utils/createProposalWithAction";
import { checkVotingRights } from "src/utils/checkVotingRights";

import { useAragon } from "src/context/AragonProvider";
import { vote } from "src/utils/vote";
import { getProposal } from "src/utils/getProposal";

const Home: React.FC = () => {
  const { context, baseClient, currentAddress } = useAragon();
  const [dao, setDao] = useState<{ address: string | undefined; plugin: Array<string> | undefined }>({
    address: "",
    plugin: [],
  });
  const [proposalId, setProposalId] = useState("");

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
      const propId = await createProposalWithAction(context, dao.plugin);
      if (propId) {
        setProposalId(propId);
      }
    }
  };
  const getProposalDetailsHandler = async () => {
    if (context) getProposal(context, proposalId);
  };
  const voteHandler = async () => {
    if (proposalId && context && currentAddress) {
      (await checkVotingRights(context, proposalId, currentAddress))
        ? vote(context, proposalId)
        : console.log("Not having voting rights");
    } else console.log("No proposal found");
  };

  return (
    <Container maxWidth="xl">
      <h1>Create DAO</h1>
      <Button disabled={!baseClient} variant="contained" sx={{ mr: 2 }} onClick={createDAOHandler}>
        Create DAO
      </Button>
      <Button disabled={!dao.plugin?.length} variant="contained" sx={{ mr: 2 }} onClick={createProposalHandler}>
        Create Proposal
      </Button>
      <Button disabled={!proposalId} variant="contained" sx={{ mr: 2 }} onClick={getProposalDetailsHandler}>
        Get Proposal Details
      </Button>
      <Button disabled={!proposalId} variant="contained" sx={{ mr: 2 }} onClick={voteHandler}>
        Vote
      </Button>
    </Container>
  );
};

export default Home;

