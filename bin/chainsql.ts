#!/usr/bin/env node
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
const ui = new inquirer.ui.BottomBar();
class ChainsqlBin {
  private netClient: Socket;
  constructor() {
    this.netClient = new Net(LoggerService.createLogger()).createClient();
    this.netClient.on("data", (result) => {
      ui.updateBottomBar(String(result));
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
      default:
        process.exit();
    }
    this.run();
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
          "EXIT",
          new inquirer.Separator() + "\n",
        ],
      },
    ];
    return inquirer.prompt(questions);
  }

  async injectionConfig() {
    const dydxConfig: any = new DydxConfig();
    const choices: any[] = flatten(
      Object.keys(dydxConfig).map((key) => {
        if (typeof dydxConfig[key] === "object") {
          return Object.keys(dydxConfig[key]).map((key2) => `${key}.${key2}`);
        }
        return key;
      })
    );

    choices.push(new inquirer.Separator());
    choices.push("Return");
    choices.push(new inquirer.Separator() + "\n");
    const { configName } = await inquirer.prompt({
      type: "list",
      name: "configName",
      message: "Select the configuration name you want to inject",
      choices,
    });
    if (configName === "Return") {
      return this.run();
    }
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
    const result = {
      id: Date.now(),
      method: CMDOpType.InjectionConfiguration,
      data: { [configName]: configValue },
    };
    this.netClient.write(JSON.stringify(result));
    ui.updateBottomBar("Send Server:" + JSON.stringify(result) + "\n");
    await this.injectionConfig();
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
    const body = {
      id: Date.now(),
      method: CMDOpType.PushTransaction,
      data: result,
    };
    this.netClient.write(JSON.stringify(body));
    ui.updateBottomBar("Send Server:" + JSON.stringify(body) + "\n");
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
    const body = {
      id: Date.now(),
      method: CMDOpType.PullTransaction,
      data: result,
    };
    this.netClient.write(JSON.stringify(body));
    ui.updateBottomBar("Send Server:" + JSON.stringify(body) + "\n");
    return result;
  }
}

new ChainsqlBin();
