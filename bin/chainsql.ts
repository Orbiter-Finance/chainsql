import inquirer from "inquirer";
import figlet from "figlet";
import chalk from "chalk";
import moment from "moment";
import { flatten } from "lodash";
import DydxConfig from "../src/config/dydx";
import { Net } from "../bin/net";
import { Socket } from "net";
import { LoggerService } from "../src/logger";
import { CMDOpType } from "../src/types";
// const ui = new inquirer.ui.BottomBar();
class ChainsqlBin {
  private netClient: Socket;
  constructor() {
    this.netClient = new Net(LoggerService.createLogger()).createClient();
    this.netClient.on("data", (result) => {
      console.log("返回信息：", result);
    });

    console.log(
      chalk.green(
        figlet.textSync("Orbiter-Finance", {
          horizontalLayout: "full",
          verticalLayout: "full",
        })
      )
    );
    this.run();
  }
  async run() {
    const answers = await this.askUserOperate();
    const { operate } = answers;
    switch (operate) {
      case CMDOpType.PullTransaction:
        await this.pullTransaction();
        break;
      case CMDOpType.PushTransaction:
        await this.pushTransaction();
        break;
      case CMDOpType.InjectionConfiguration:
        await this.injectionConfig();
        break;
    }
    this.netClient.destroy();
  }
  askUserOperate() {
    const questions = [
      {
        type: "list",
        name: "operate",
        message: "What do you want to do?",
        choices: [
          new inquirer.Separator(),
          ...Object.values(CMDOpType),
          new inquirer.Separator(),
          "\n",
        ],
      },
    ];
    return inquirer.prompt(questions);
  }

  async injectionConfig() {
    const dydxConfig: any = new DydxConfig();
    const choices: string[] = flatten(
      Object.keys(dydxConfig).map((key) => {
        if (typeof dydxConfig[key] === "object") {
          return Object.keys(dydxConfig[key]).map((key2) => `${key}.${key2}`);
        }
        return key;
      })
    );
    const { configName } = await inquirer.prompt({
      type: "list",
      name: "configName",
      message: "Select the configuration name you want to inject",
      choices,
    });
    let configValue = "";
    if (
      [
        "apiKeyCredentials.key",
        "apiKeyCredentials.secret",
        "apiKeyCredentials.passphrase",
      ].includes(configName)
    ) {
      configValue = await inquirer
        .prompt([
          {
            type: "password",
            mask: "*",
            message: `Enter a [${configName}] : `,
            name: "configValue",
          },
        ])
        .then((res) => res.configValue);
    } else {
      configValue = await inquirer
        .prompt([
          {
            type: "input",
            message: `Enter a [${configName}] : `,
            name: "configValue",
          },
        ])
        .then((res) => res.configValue);
    }
    this.netClient.write(
      JSON.stringify({
        id: Date.now(),
        method: CMDOpType.InjectionConfiguration,
        data: { [configName]: configValue },
      })
    );
    return configValue;
  }
  async pushTransaction() {
    const questions = [
      {
        type: "input",
        name: "startTime",
        message: "Transaction Start Time: ",
        default() {
          return moment().subtract(1, "M").unix();
        },
      },
      {
        type: "input",
        name: "endTime",
        message: "Transaction End Time: ",
        default() {
          return moment().unix();
        },
      },
    ];
    const result = await inquirer.prompt(questions);
    this.netClient.write(
      JSON.stringify({
        id: Date.now(),
        method: CMDOpType.PushTransaction,
        data: result,
      })
    );
    return result;
  }
  async pullTransaction() {
    const questions = [
      {
        type: "input",
        name: "startTime",
        message: "Transaction Start Time: ",
        default() {
          return moment().subtract(1, "months").unix();
        },
      },
      {
        type: "input",
        name: "endTime",
        message: "Transaction End Time: ",
        default() {
          return moment().unix();
        },
      },
    ];
    const result = await inquirer.prompt(questions);
    this.netClient.write(
      JSON.stringify({
        id: Date.now(),
        method: CMDOpType.PullTransaction,
        data: result,
      })
    );
  }
}

new ChainsqlBin();
// import { Command } from "commander";
// import "dotenv/config";
// import Dydx from "../src/service/dydx";
// import Context from "../src/context";

// const program = new Command();
// program
//   .version('0.1.0')
//   .argument('<username>', 'user to login')
//   .argument('[password]', 'password for user, if required', 'no password given')
//   .action((username, password) => {
//     console.log('username:', username);
//     console.log('password:', password);
//   });
// // program
// //   .version("0.0.1")
// //   .usage("chainsql")
// //   .description("Help")
// //   .option("-d, --debug", "open debug", false);

// // program
// //   .command("pullTransactionByDatetime <keys> <startAt> <endAt>")
// //   .description("pullTransactionByDatetime")
// //   .action(async(key: string, startAt: string, endAt: string) => {
// //     const keyList = key.split(".");
// //     if (keyList.length != 3) {
// //       throw new Error("keys Format(KEY.SECERT.PASSPHRASE) Format Error");
// //     }
// //     process.env["KEY"] = keyList[0];
// //     process.env["SECERT"] = keyList[1];
// //     process.env["PASSPHRASE"] = keyList[2];
// //     const ctx = new Context();
// //     const dydxService = new Dydx(ctx);
// //     return await dydxService.pullTransactionByDatetime(startAt, endAt);
// //   });
// // program
// //   .command("pushTransactionByDatetime <keys> <startAt> <endAt>")
// //   .description("pushTransactionByDatetime")
// //   .action(async(keys: string, startAt: string, endAt: string) => {
// //     const keyList = keys.split(".");
// //     if (keyList.length != 3) {
// //       throw new Error("keys Format(KEY.SECERT.PASSPHRASE) Format Error");
// //     }
// //     process.env["KEY"] = keyList[0];
// //     process.env["SECERT"] = keyList[1];
// //     process.env["PASSPHRASE"] = keyList[2];
// //     const ctx = new Context();
// //     const dydxService = new Dydx(ctx);
// //     return await dydxService.pushTransactionByDatetime(startAt, endAt);
// //   });
// program.parse(process.argv);
