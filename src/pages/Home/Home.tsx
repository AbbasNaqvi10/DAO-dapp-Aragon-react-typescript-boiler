import React, { useEffect } from "react";
import { Container, Typography, ListItemText, ListItem, Button, Skeleton } from "@mui/material";
import { providers } from "ethers";
import { Link } from "react-router-dom";
import useWallet from "src/hooks/useWallet";
import useBalances from "src/hooks/useBalances";
import useDecimals from "src/hooks/useDecimals";
import { toEth } from "src/utils/common";
import { dismissNotifyAll, notifyError, notifyLoading, notifySuccess } from "src/api/notifications";
// import { multisignClient } from "src/utils/multisignClient";
import { createDAO } from "src/utils/createDAO";
import { initClient } from "src/config/argonClientConfig";
import { createProposalWithAction } from "src/utils/createProposalWithAction";

interface IProps {}

const Home: React.FC<IProps> = () => {
  // const { balance, displayAccount, currentAddress } = useWallet();
  // const { balances, isLoading } = useBalances();
  // const { decimals } = useDecimals();
  const { signer } = useWallet();

  useEffect(() => {
    if (signer)
      (async function () {
        const { context, client } = initClient(signer);
        const { daoAddress, pluginAddresses } = await createDAO(client);
        console.log("dao", daoAddress, pluginAddresses);
        // createProposalWithAction(context, [
        //   "0x6eF2880149Bf5B54d071CD51f77E07e87de27ae5",
        //   "0x3F58c702D8E9502E8E661c464Ab5AEd83eB8A34A",
        // ]);
      })();
  }, [signer]);

  return (
    <Container maxWidth="xl">
      <h1>Create DAO</h1>
      {/* <Typography>
        <b>Balance:</b> {balance?.formatted}
      </Typography>
      <Typography>
        <b>Current Wallet:</b> {currentAddress}
      </Typography>
      <Typography>
        <b>Current Wallet:</b> {displayAccount}
      </Typography>
      <Link to="/test">Test</Link>
      <Typography variant="h5">Balances:-</Typography>
      {balances &&
        !isLoading &&
        Object.entries(balances).map(([address, balance]) => (
          <ListItem key={address}>
            <ListItemText>
              <b>Address:</b> {address} <b>Balance:</b> {toEth(balance, decimals && decimals[address])}
            </ListItemText>
          </ListItem>
        ))}
      {isLoading && <Skeleton height={200} />}
      <Typography variant="h5">Notifications</Typography>
      <Button
        variant="outlined"
        sx={{ mr: 2 }}
        onClick={() => {
          notifySuccess("Approving Token!", "Please wait...");
        }}
      >
        success
      </Button>

      <Button
        variant="outlined"
        sx={{ mr: 2 }}
        onClick={() => {
          notifyError("Error!", "Something went wrong...");
        }}
      >
        error
      </Button>

      <Button
        variant="outlined"
        sx={{ mr: 2 }}
        onClick={() => {
          notifyLoading("Approving!", "Please wait...");
        }}
      >
        loading
      </Button>

      <Button
        variant="outlined"
        sx={{ mr: 2 }}
        onClick={() => {
          dismissNotifyAll();
        }}
      >
        dismiss
      </Button> */}
    </Container>
  );
};

export default Home;

