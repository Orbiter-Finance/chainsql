import { ApiKeyCredentials } from "@dydxprotocol/v3-client";

export default class DydxConfig {
  public NETWORK_ID: number;
  public PUSH_URL: string;
  public PUSH_TRANSACTION_INTERVAL: number;
  public PUSH_TRANSACTION_LIMIT: number;
  public ENDPOINT: string;
  public PULL_TRANSACTION_INTERVAL: number;
  public apiKeyCredentials: ApiKeyCredentials;
  constructor() {
    const env = process.env;
    this.NETWORK_ID = Number(env["NETWORK_ID"] || 3);
    this.PUSH_URL = String(env["PUSH_URL"]);
    this.PUSH_TRANSACTION_INTERVAL = Number(
      env["PUSH_TRANSACTION_INTERVAL"] || 10
    );
    this.PULL_TRANSACTION_INTERVAL = Number(
      env["PULL_TRANSACTION_INTERVAL"] || 30
    );
    this.PUSH_TRANSACTION_LIMIT = Number(env["PUSH_TRANSACTION_LIMIT"] || 100);
    this.apiKeyCredentials = {
      key: String(env["KEY"]),
      secret: String(env["SECERT"]),
      passphrase: String(env["PASSPHRASE"]),
    };
    this.ENDPOINT =
      this.NETWORK_ID === 1
        ? "https://api.dydx.exchange"
        : "https://api.stage.dydx.exchange";
  }
}
