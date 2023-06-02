import axios from "axios";

export const FetchAllDao = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `  query Dao {
      daos{
        id
        subdomain
        metadata
        createdAt
        plugins{
          pluginAddress
          id
          }
        proposals{
          id
          actions{
            id
            data
            value
            to
          }
          creator
          endDate
          metadata
          startDate
        }
        }
      }`;

    axios
      .post("https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mumbai/api", { query })
      .then((response) => {
        const dao = response.data;
        resolve(dao);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const FetchDaoByAddress = (address: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `query Dao {
      dao(id: "${address}"){
        id
        subdomain
        metadata
        createdAt
        creator
        plugins{
          pluginAddress
          id
        }
        proposals{
          id
          actions{
            id
            data
            value
            to
          }
          creator
          endDate
          metadata
          startDate
        }
      }
    }`;

    axios
      .post("https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mumbai/api", { query })
      .then((response) => {
        const daoDetails = response.data;
        console.log("DAO: ", daoDetails);
        resolve(daoDetails.data.dao);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const FetchDaosByCreator = (address: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `query Dao {
      daos(where: {creator: "${address}"}){
        id
        subdomain
        metadata
        createdAt
        creator
        plugins{
          pluginAddress
          id
        }
        proposals{
          id
          actions{
            id
            data
            value
            to
          }
          creator
          endDate
          metadata
          startDate
        }
      }
    }`;

    axios
      .post("https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mumbai/api", { query })
      .then((response) => {
        const daoDetails = response.data;
        resolve(daoDetails.data.daos);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
