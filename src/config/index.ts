import dotenv from "dotenv";
import DydxConfig from "./dydx";
export default class ConfigService {
  public dydx: DydxConfig;
  public makerAddress!: string;
  public debug: boolean = false;
  constructor() {
    const result = dotenv.config();
    if (result.error) {
      throw result.error;
    }
    const config = result.parsed || {};
    this.makerAddress = config['MAKER_ADDRESS'];
    this.dydx = new DydxConfig(config);
    this.debug = Boolean(config['DEBUG'] || 0);
  }
}
