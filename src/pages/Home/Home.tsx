import React, { useState, useEffect } from "react";
import { Container, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import { createDAO } from "src/utils/createDAO";
import { createProposalWithAction } from "src/utils/createProposalWithAction";
import { checkVotingRights } from "src/utils/checkVotingRights";

import { useAragon } from "src/context/AragonProvider";
import { vote } from "src/utils/vote";
import { getProposal } from "src/utils/getProposal";
import { getDaoDetails } from "src/utils/getDaoDetails";

const Home: React.FC = () => {
  const { context, baseClient, currentAddress } = useAragon();
  const [dao, setDao] = useState<
    [
      {
        address: string | undefined;
        plugin: Array<string> | undefined;
        proposalIds: Array<string> | undefined;
      }
    ]
  >([
    {
      address: "",
      plugin: [],
      proposalIds: [],
    },
  ]);
  const [currentDao, setCurrentDao] = useState("");
  const [pluginAddress, setPluginAddress] = useState("");
  const setDaoToLocalStorage = (
    dao: [
      {
        address: string | undefined;
        plugin: Array<string> | undefined;
        proposalIds: Array<string> | undefined;
      }
    ]
  ) => {
    localStorage.setItem("dao", JSON.stringify(dao));
  };
  const getDaoFromLocalStorage = (name: string) => {
    return localStorage.getItem(name);
  };
  useEffect(() => {
    const dao = getDaoFromLocalStorage("dao");
    if (dao) {
      setDao(JSON.parse(dao));
      console.log(dao);
    }
  }, []);
  useEffect(() => {
    if (dao) {
      console.log(dao);
      setDaoToLocalStorage(dao);
    }
  }, [dao]);
  const findDao = (address: string) => {
    for (let index = 0; index < dao.length; index++) {
      if (dao[index].address === address) {
        return { dao: dao[index], index: index };
      }
    }
  };
  const createDAOHandler = async () => {
    if (baseClient) {
      const { daoAddress, pluginAddresses } = await createDAO(baseClient);
      setDao((dao) => [...dao, { address: daoAddress, plugin: pluginAddresses, proposalIds: [] }].flat() as typeof dao);
    }
  };
  const handleJoinClick = async (daoAddress: string | undefined, pluginAddesses: Array<string> | undefined) => {
    if (daoAddress) setCurrentDao(daoAddress);
    if (pluginAddesses) setPluginAddress(pluginAddesses[0]);
    console.log("DAO: ", daoAddress);
    console.log("Plugin Addresses: ", pluginAddesses);
  };
  const createProposalHandler = async (daoAddress: string, pluginAddress: string) => {
    if (baseClient && context) {
      const propId = await createProposalWithAction(context, pluginAddress);
      const daoDetails = findDao(daoAddress);
      if (propId && daoDetails?.dao.proposalIds) {
        dao[daoDetails?.index] = {
          address: daoAddress,
          plugin: [pluginAddress],
          proposalIds: [...daoDetails.dao.proposalIds, propId],
        };
      } else if (propId && daoDetails) {
        dao[daoDetails?.index] = {
          address: daoAddress,
          plugin: [pluginAddress],
          proposalIds: [propId],
        };
      }
    }
  };

  // const getProposalDetailsHandler = async () => {
  //   if (context) getProposal(context, proposalId);
  // };
  // const voteHandler = async () => {
  //   if (proposalId && context && currentAddress) {
  //     (await checkVotingRights(context, proposalId, currentAddress))
  //       ? vote(context, proposalId)
  //       : console.log("Not having voting rights");
  //   } else console.log("No proposal found");
  // };

  return (
    <Container maxWidth="xl">
      <h1>Create DAO</h1>
      <Button disabled={!baseClient} variant="contained" sx={{ mr: 2 }} onClick={createDAOHandler}>
        Create DAO
      </Button>
      {/* <Button disabled={!proposalId} variant="contained" sx={{ mr: 2 }} onClick={getProposalDetailsHandler}>
        Get Proposal Details
      </Button> */}
      {/* <Button disabled={!proposalId} variant="contained" sx={{ mr: 2 }} onClick={voteHandler}>
        Vote
      </Button> */}
      <Typography variant="h5">DAO List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Plugin Addresses</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dao.map((data) => (
            <TableRow key={data.address}>
              <TableCell>{data.address}</TableCell>
              {data.plugin?.map((plugin) => (
                <TableCell>{plugin}</TableCell>
              ))}
              <TableCell>
                <Button variant="contained" onClick={() => handleJoinClick(data.address, data.plugin)}>
                  Join
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Home;

