export interface Plugins {
  pluginAddress: string;
  id: string;
}
export interface Action {
  id: string;
  to: string;
  data: string;
  value: string;
}
export interface Proposals {
  id: string;
  creator: string;
  metadata: string;
  startDate: string;
  endDate: string;
  actions: Array<Action>;
}
export interface DAO {
  id: string;
  metadata: string;
  subdomain: string;
  createdAt: string;
  creator: string;
  plugins: Array<Plugins>;
  proposals: Array<Proposals>;
}
