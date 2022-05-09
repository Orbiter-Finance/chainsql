import { Sequelize } from "sequelize";
import Web3 from "web3";
import { Logger } from "winston";
import { initModels } from "../model/init-models";
import Config from "./config";
import { LoggerService } from "./logger";

export default class Context {
  public config: Config;
  public db: Sequelize;
  public logger: Logger;
  // public web3: Web3;
  constructor() {
    this.config = new Config();
    this.logger = LoggerService.createLogger();
    this.db = new Sequelize({
      dialect: "sqlite",
      storage: `./data/${this.config.makerAddress}.db`,
      // storage: `./data/database.db`,
      // logging: false
    });
    initModels(this.db);
    this.db.sync();
  }
}
