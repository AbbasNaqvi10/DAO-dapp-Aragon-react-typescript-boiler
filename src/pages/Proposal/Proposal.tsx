import React, { useState, useEffect } from "react";
import { Container, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { DAO } from "../../interface/interfaces";
import { FetchDaoByAddress } from "src/utils/fetchDao";

interface Action {
  id: string;
  data: string;
  value: string;
  to: string;
}

interface Proposal {
  id: string;
  actions: Action[];
  creator: string;
  endDate: string;
  metadata: string;
  startDate: string;
}

interface Props {
  daoAddress: string;
}

const ProposalPage: React.FC<Props> = (props: Props) => {
  const [dao, setDao] = useState<DAO | null>(null);

  useEffect(() => {
    if (props.daoAddress) {
      FetchDaoByAddress(props.daoAddress)
        .then((daoDetails) => {
          setDao(daoDetails);
          console.log(daoDetails);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [props.daoAddress]);

  const createProposalHandler = async () => {
    // Implement createProposalHandler logic
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h1">DAO Details</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Subdomain</TableCell>
            <TableCell>Metadata</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Plugins</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dao && (
            <TableRow key={dao.id}>
              <TableCell>{dao.id}</TableCell>
              <TableCell>{dao.subdomain}</TableCell>
              <TableCell>{dao.metadata}</TableCell>
              <TableCell>{dao.createdAt}</TableCell>
              <TableCell>
                {dao.plugins.map((plugin: any) => (
                  <TableCell key={plugin.id}>{plugin.id}</TableCell>
                ))}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Typography variant="h1">Proposals Details</Typography>
      <Button variant="contained" sx={{ mr: 2 }} onClick={createProposalHandler}>
        Create Proposal
      </Button>
      {/* <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Metadata</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Creator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dao?.proposals.map((proposal) => {
            const { id, actions, creator } = proposal;
            return (
              <React.Fragment key={id}>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="h2">Proposal ID: {id}</Typography>
                  </TableCell>
                </TableRow>
                {actions > 0 &&
                  actions.map((action: Action, index: number) => {
                    const { id: actionId, data, value, to } = action;
                    return (
                      <TableRow key={index}>
                        <TableCell>{actionId}</TableCell>
                        <TableCell>{data}</TableCell>
                        <TableCell>{value}</TableCell>
                        <TableCell>{to}</TableCell>
                        <TableCell>{creator}</TableCell>
                      </TableRow>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table> */}
    </Container>
  );
};

export default ProposalPage;
