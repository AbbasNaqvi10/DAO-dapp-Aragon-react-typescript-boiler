import axios from "axios";

export const FetchProposalsByDaoAddress = (address: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `query Proposal {
      iproposals(where:{dao:"${address}"}){
        id
        creator
        metadata
        startDate
        endDate
        actions{
          id
          data
          value
          to
        }
      }
      }`;

    axios
      .post("https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mumbai/api", { query })
      .then((response) => {
        const proposalsDetails = response.data;
        console.log("proposals: ", proposalsDetails.data.iproposals);
        resolve(proposalsDetails.data.iproposals);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
