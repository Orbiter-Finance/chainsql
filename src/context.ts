import { Server, Socket } from "net";
import { Sequelize } from "sequelize";
import { Logger } from "winston";
import { initModels } from "../model/init-models";
import Config from "./config";
import { LoggerService } from "./logger";
import { Net } from "../bin/net";

export default class Context {
  public config: Config;
  public db: Sequelize;
  public logger: Logger;
  constructor() {
    this.config = new Config();
    this.logger = LoggerService.createLogger();
    this.db = new Sequelize({
      dialect: "sqlite",
      storage: `./runtime/data/${this.config.makerAddress}.db`,
      // storage: `./data/database.db`,
      logging: false,
    });
    initModels(this.db);
    this.db.sync();
    
  }
}
