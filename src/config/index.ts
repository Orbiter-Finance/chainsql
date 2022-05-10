import dotenv from "dotenv";
dotenv.config()
import DydxConfig from "./dydx";
export default class ConfigService {
  public dydx: DydxConfig;
  public makerAddress!: string;
  public debug: boolean = false;
  constructor() {
    this.makerAddress = String(process.env['MAKER_ADDRESS']);
    this.dydx = new DydxConfig();
    this.debug = Boolean(process.env['DEBUG'] || 0);
  }
}
