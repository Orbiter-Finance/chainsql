import schedule, { Job } from "node-schedule";
import { DydxClient } from "@dydxprotocol/v3-client";
import moment from "moment";
import axios from "axios";
import axiosRetry from "axios-retry";
import { Transactions } from "../../model/transactions";
import Context from "../context";
import { Op } from "sequelize";
const Web3 = require("web3");
axiosRetry(axios);
// const lastPullTime = dayjs().format();
const lastPullTime = "2020-01-01 00:00";
export default class Dydx {
  private job: Job | undefined;
  private dydxClient!: DydxClient;
  private ctx: Context;

  constructor(context: Context) {
    this.ctx = context;
    const apiKeyCredentials = this.ctx.config.dydx.apiKeyCredentials;
    if (!apiKeyCredentials) {
      throw new Error(`Api Key Not Config!`);
    }
    if (
      !apiKeyCredentials.key ||
      !apiKeyCredentials.secret ||
      !apiKeyCredentials.passphrase
    ) {
      throw new Error(`Api Key Config Value Not Found`);
    }
    const web3 = new Web3();
    this.dydxClient = new DydxClient(String(this.ctx.config.dydx.ENDPOINT), {
      web3,
      apiKeyCredentials,
      apiTimeout: 3000,
      networkId: this.ctx.config.dydx.NETWORK_ID,
    });
  }

  public async startTimer() {
    const { user } = await this.dydxClient.private.getUser();
    if (!user) {
      throw new Error("Get dydx User Fail");
    }
    if (
      user.ethereumAddress.toLowerCase() !=
      this.ctx.config.makerAddress.toLowerCase()
    ) {
      throw new Error(
        `ethereumAddress ${user.ethereumAddress} & Env MakerAddress ${this.ctx.config.makerAddress} Not Equals`
      );
    }
    this.ctx.config.makerAddress = user.ethereumAddress;
    const { PULL_TRANSACTION_INTERVAL, PUSH_TRANSACTION_INTERVAL } =
      this.ctx.config.dydx;
    this.job = schedule.scheduleJob("* */1 * * * *", () => {
      if (moment().unix() % PULL_TRANSACTION_INTERVAL === 0) {
        this.pullLatestTransaction();
      }
      if (moment().unix() % PUSH_TRANSACTION_INTERVAL === 0) {
        this.pushLatestTransaction();
      }
    });
  }
  /**
   * From Dydx Remote Pull Transaction To Local
   */
  public async pullLatestTransaction() {
    try {
      let trxList = await this.getTransfers(100);
      trxList = trxList.filter((row) => {
        return moment(row.createdAt).isAfter(lastPullTime);
      });
      if (trxList.length > 0) {
        Transactions.bulkCreate(trxList, {
          updateOnDuplicate: ["status"],
        })
          .then((resp) => {
            this.ctx.logger.info("pullLatestTransaction success:", {
              txlist: resp.map((row) => row.id),
            });
          })
          .catch((error) => {
            this.ctx.logger.error("pullLatestTransaction save error:", error);
          });
      }
    } catch (error) {
      this.ctx.logger.error("pullLatestTransaction error:", error);
    }
  }
  /**
   * Push Transaction To Dashboard
   */
  public pushLatestTransaction() {
    return new Promise((resolve, reject) => {
      Transactions.findAll({
        limit: this.ctx.config.dydx.PUSH_TRANSACTION_LIMIT,
        raw: true,
        order: [["createdAt", "desc"]],
      })
        .then((trxList) => {
          if (trxList.length > 0) {
            this.requestNotify(trxList)
              .then((result) => {
                this.ctx.logger.info("pushLatestTransaction success:", {
                  txlist: trxList.map((row) => row.id),
                });
                resolve(result);
              })
              .catch((error) => {
                this.ctx.logger.info(
                  "pushLatestTransaction RequestNotify error:",
                  error.message
                );
              });
          }
        })
        .catch((error) => {
          this.ctx.logger.error("pushLatestTransaction error:", error.message);
          reject(error);
        });
    });
  }
  /**
   * From Dydx Remote By Start And End Pull Transaction To Local
   * @param startdAt
   * @param endAt
   * @returns
   */
  public pullTransactionByDatetime(
    startdAt: Date | string,
    endAt: Date | string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let allTrxList = [];
        let createdBeforeOrAt = moment(endAt).toISOString();
        while (true) {
          let trxList: any[] = await this.getTransfers(100, createdBeforeOrAt);
          trxList = trxList.filter((trx) => {
            return (
              moment(trx.createdAt).isSameOrBefore(endAt) &&
              moment(trx.createdAt).isSameOrAfter(startdAt)
            );
          });
          if (!trxList || trxList.length <= 0) {
            break;
          }
          allTrxList.push(...trxList);
          Transactions.bulkCreate(trxList, {
            updateOnDuplicate: ["status"],
          })
            .then((resp) => {
              this.ctx.logger.info("pullTransactionByDatetime success:", {
                txlist: resp.map((row) => row.id),
              });
            })
            .catch((error) => {
              this.ctx.logger.error(`pullTransactionByDatetime error:`, error);
            });
          const last = trxList[trxList.length - 1];
          createdBeforeOrAt = moment(last.createdAt).toISOString();
        }
        resolve(allTrxList);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Push Transaction To Dashboard startdAt - endAt
   * @param startdAt
   * @param endAt
   * @returns
   */
  public pushTransactionByDatetime(
    startdAt: Date | string,
    endAt: Date | string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Transactions.findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.gte]: moment(startdAt).format("YYYY-MM-DD HH:mm:ss"),
            [Op.lte]: moment(endAt).format("YYYY-MM-DD HH:mm:ss"),
          },
        },
        order: [["createdAt", "desc"]],
      })
        .then((trxList) => {
          if (trxList.length > 0) {
            this.requestNotify(trxList)
              .then((result) => {
                this.ctx.logger.info("pushTransactionByDatetime success:", {
                  txlist: trxList.map((row) => row.id),
                });
                resolve(result);
              })
              .catch((error) => {
                this.ctx.logger.info(
                  "pushTransactionByDatetime RequestNotify error:",
                  error.message
                );
              });
          }
        })
        .catch((error) => {
          this.ctx.logger.error("pushTransactionByDatetime error:", error);
          reject(error);
        });
    });
  }
  public async getTransfers(
    limit: number = 100,
    createdBeforeOrAt?: string
  ): Promise<any[]> {
    return await this.dydxClient.private
      .getTransfers({
        limit,
        createdBeforeOrAt: moment(
          createdBeforeOrAt || new Date()
        ).toISOString(),
      })
      .then((result: { transfers: any }) => result.transfers)
      .then((result: any) => {
        return (
          (result &&
            result.map((row: { createdAt: any }) => {
              row.createdAt = moment(row.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              return row;
            })) ||
          []
        );
      });
  }

  public requestNotify(txlist: Transactions[]) {
    const address = this.ctx.config.makerAddress;
    return axios.post(
      this.ctx.config.dydx.PUSH_URL,
      { txlist, address },
      {
        "axios-retry": {
          retries: 10,
          retryDelay: (retryCount: number) => {
            return retryCount * 1000;
          },
        },
      }
    );
  }
}
