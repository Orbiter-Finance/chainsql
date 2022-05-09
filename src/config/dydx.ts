import { ApiKeyCredentials } from "@dydxprotocol/v3-client";

export default class DydxConfig {
  public NETWORK_ID: number = 3;
  public PUSH_URL: string;
  public PUSH_TRANSACTION_INTERVAL: number;
  public PUSH_TRANSACTION_LIMIT: number;
  public ENDPOINT: string;
  public PULL_TRANSACTION_INTERVAL: number;
  public apiKeyCredentials: ApiKeyCredentials;
  constructor(config: any) {
    const env = process.env;
    this.NETWORK_ID = env["NETWORK_ID"] || config.NETWORK_ID;
    this.PUSH_URL = env["PUSH_URL"] || config.PUSH_URL;
    this.PUSH_TRANSACTION_INTERVAL = Number(
      env["PUSH_TRANSACTION_INTERVAL"] || config.PUSH_TRANSACTION_INTERVAL
    );
    this.PULL_TRANSACTION_INTERVAL = Number(
      env["PULL_TRANSACTION_INTERVAL"] || config.PULL_TRANSACTION_INTERVAL
    );
    this.PUSH_TRANSACTION_LIMIT = Number(
      env["PUSH_TRANSACTION_LIMIT"] || config.PUSH_TRANSACTION_LIMIT
    );
    this.apiKeyCredentials = {
      key: env["KEY"] || config.KEY,
      secret: env["SECERT"] || config.SECERT,
      passphrase: env["PASSPHRASE"] || config.PASSPHRASE,
    };
    this.ENDPOINT =
      this.NETWORK_ID === 1
        ? "https://api.dydx.exchange"
        : "https://api.stage.dydx.exchange";
  }
}
