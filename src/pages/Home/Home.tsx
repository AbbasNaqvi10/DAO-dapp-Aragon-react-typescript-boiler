import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useAragon } from "src/context/AragonProvider";
import { createDAO } from "src/utils/createDAO";
import { FetchDaoByCreator } from "src/utils/fetchDao";
import ProposalPage from "../Proposal/Proposal";
import { DAO, Plugins } from "../../interface/interfaces";

const Home: React.FC = () => {
  const { context, baseClient, currentAddress } = useAragon();
  const [dao, setDao] = useState<DAO[]>([]);
  const [isDaoCreated, setIsDaoCreated] = useState<boolean>(false);

  useEffect(() => {
    const fetchDaoByCreator = async () => {
      try {
        if (currentAddress) {
          const daoDetails = await FetchDaoByCreator(currentAddress);
          setDao(daoDetails);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (currentAddress) {
      fetchDaoByCreator();
    }
  }, [currentAddress, isDaoCreated]);

  const createDAOHandler = async () => {
    if (baseClient) {
      await createDAO(baseClient);
      setIsDaoCreated(true);
    }
  };

  const handleJoinClick = (daoAddress: string, pluginAddresses: Plugins[]) => {
    // Handle the join button click event
    // You can use this function to navigate to the ProposalPage or perform any other action
    console.log("Dao address", daoAddress);
    console.log("plugin address", pluginAddresses);
  };

  return (
    <Container maxWidth="xl">
      <h1>Create DAO</h1>
      <Button disabled={!baseClient} variant="contained" sx={{ mb: 2 }} onClick={createDAOHandler}>
        Create DAO
      </Button>
      <Typography variant="h5">DAO List</Typography>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Subdomain</TableCell>
              <TableCell>Metadata</TableCell>
              <TableCell>Create By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Plugin Addresses</TableCell>
              <TableCell>No. of Proposals</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dao.map((data) => (
              <TableRow key={data.id}>
                <TableCell sx={{ minWidth: "100px" }}>{data.id}</TableCell>
                <TableCell sx={{ minWidth: "100px" }}>{data.subdomain}</TableCell>
                <TableCell>{data.metadata}</TableCell>
                <TableCell>{data.creator}</TableCell>
                <TableCell>{data.createdAt}</TableCell>
                <TableCell>
                  {data.plugins && Array.isArray(data.plugins) ? (
                    <Table size="small">
                      <TableBody>
                        {data.plugins.map((plugin) => (
                          <TableRow key={plugin.id}>
                            <TableCell>{plugin.id}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    "No plugins"
                  )}
                </TableCell>
                <TableCell>{data.proposals?.length || 0}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleJoinClick(data.id, data.plugins)}>
                    Join
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Home;

