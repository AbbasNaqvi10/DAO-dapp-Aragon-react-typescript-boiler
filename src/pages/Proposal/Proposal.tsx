import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useAragon } from "src/context/AragonProvider";
import { DAO, Proposals } from "../../interface/interfaces";
import { FetchProposalsByDaoAddress } from "src/utils/fetchProposals";
import { createProposalWithAction } from "src/utils/createProposalWithAction";
import { checkVotingRights } from "../../utils/checkVotingRights";
import { vote } from "../../utils/vote";
import { useAppDispatch, useAppSelector } from "src/state";

const ProposalPage: React.FC = () => {
  const { context, currentAddress } = useAragon();
  const [proposals, setProposals] = useState<Proposals[] | null>(null);
  const [isProposalCreated, setIsProposalCreated] = useState<boolean>(false);
  const daoFromStore = useAppSelector((store) => store.dao.dao);
  const { daoAddress } = useParams();

  useEffect(() => {
    const fetchProposalByDAO = async () => {
      try {
        if (daoAddress) {
          console.log(daoFromStore);
          const proposalsDetails = await FetchProposalsByDaoAddress(daoAddress);
          setProposals(proposalsDetails);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (daoAddress) {
      fetchProposalByDAO();
    }
  }, [daoAddress]);
  useEffect(() => {
    const fetchProposalByDAO = async () => {
      try {
        if (daoFromStore) {
          console.log(daoFromStore);
          const proposalsDetails = await FetchProposalsByDaoAddress(daoFromStore.id);
          setProposals(proposalsDetails);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (daoFromStore) {
      fetchProposalByDAO();
    }
  }, [daoFromStore, isProposalCreated]);
  const createProposalHandler = async () => {
    try {
      if (context && daoFromStore) {
        const proposalId = await createProposalWithAction(context, daoFromStore.plugins[0].id);
        if (proposalId) setIsProposalCreated(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const voteHandler = async (proposalId: string) => {
    try {
      if (context) {
        const isVoted = await vote(context, proposalId);
        console.log(isVoted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h5">Proposals Details</Typography>
      <Button variant="contained" sx={{ mr: 2 }} onClick={createProposalHandler}>
        Create Proposal
      </Button>
      {context && currentAddress && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell>Metadata</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Action Id</TableCell>
              <TableCell>Action Data</TableCell>
              <TableCell>Action Value</TableCell>
              <TableCell>Action To</TableCell>
              <TableCell>Vote</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals?.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.creator}</TableCell>
                <TableCell>{data.metadata}</TableCell>
                <TableCell>{data.startDate}</TableCell>
                <TableCell>{data.endDate}</TableCell>
                <TableCell>
                  {data.actions && Array.isArray(data.actions) ? (
                    <Table size="small">
                      <TableBody>
                        {data.actions.map((action) => (
                          <TableRow key={action.id}>
                            <TableCell>{action.id}</TableCell>
                            <TableCell>{action.data}</TableCell>
                            <TableCell>{action.value}</TableCell>
                            <TableCell>{action.to}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    "No actions"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    disabled={!checkVotingRights(context, data.id, currentAddress)}
                    variant="contained"
                    onClick={() => voteHandler(data.id)}
                  >
                    Vote
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default ProposalPage;
