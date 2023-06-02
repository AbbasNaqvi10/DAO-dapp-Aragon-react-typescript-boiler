import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { FetchDaoByAddress, FetchDaosByCreator } from "src/utils/fetchDao";
import { DAO, Plugins } from "../../interface/interfaces";
import { setDao } from "src/state/dao/daoReducer";
import { useAppDispatch, useAppSelector } from "src/state";

const Home: React.FC = () => {
  const { context, baseClient, currentAddress } = useAragon();
  const [daos, setDaos] = useState<DAO[]>([]);
  const [isDaoCreated, setIsDaoCreated] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const daoFromStore = useAppSelector((store) => store.dao.dao);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDaoByCreator = async () => {
      try {
        if (currentAddress) {
          const daosDetails = await FetchDaosByCreator(currentAddress);
          setDaos(daosDetails);
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

  const handleJoinClick = async (daoAddress: string, pluginAddresses: Plugins[]) => {
    try {
      if (currentAddress) {
        const daoDetails = await FetchDaoByAddress(daoAddress);
        dispatch(setDao(daoDetails));
        navigate(`/proposals/${daoAddress}`);
      }
    } catch (error) {
      console.error(error);
    }
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
            {daos.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.subdomain}</TableCell>
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

