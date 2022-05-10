#!/usr/bin/env node
import { Command } from "commander";
import "dotenv/config";
import Dydx from "../src/service/dydx";
import Context from "../src/context";

const program = new Command();
program
  .version("0.0.1")
  .usage("chainsql")
  .description("Help")
  .option("-d, --debug", "open debug", false);

program
  .command("pullTransactionByDatetime <keys> <startAt> <endAt>")
  .description("pullTransactionByDatetime")
  .action((key: string, startAt: string, endAt: string) => {
    const keyList = key.split(".");
    if (keyList.length != 3) {
      throw new Error("keys Format(KEY.SECERT.PASSPHRASE) Format Error");
    }
    process.env["KEY"] = keyList[0];
    process.env["SECERT"] = keyList[1];
    process.env["PASSPHRASE"] = keyList[2];
    const ctx = new Context();
    new Dydx(ctx).pullTransactionByDatetime(startAt, endAt);
  });
program
  .command("pushTransactionByDatetime <keys> <startAt> <endAt>")
  .description("pushTransactionByDatetime")
  .action((keys: string, startAt: string, endAt: string) => {
    const keyList = keys.split(".");
    if (keyList.length != 3) {
      throw new Error("keys Format(KEY.SECERT.PASSPHRASE) Format Error");
    }
    process.env["KEY"] = keyList[0];
    process.env["SECERT"] = keyList[1];
    process.env["PASSPHRASE"] = keyList[2];
    const ctx = new Context();
    new Dydx(ctx).pushTransactionByDatetime(startAt, endAt);
  });
program.parse(process.argv);

