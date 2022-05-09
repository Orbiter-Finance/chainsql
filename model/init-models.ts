import { Sequelize } from "sequelize";
import { Transactions } from "./transactions";

export function initModels(sequelize: Sequelize) {
  Transactions.bootstrap(sequelize);
  return {
    Transactions,
  };
}
