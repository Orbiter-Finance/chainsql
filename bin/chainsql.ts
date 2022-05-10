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
  .command("pullTransactionByDatetime <key> <startAt> <endAt>")
  .description("pullTransactionByDatetime")
  .action((key: string, startAt: string, endAt: string) => {
    const keys = key.split("|");
    if (keys.length != 3) {
      throw new Error("KEY|SECERT|PASSPHRASE Format Error");
    }
    process.env["KEY"] = keys[0];
    process.env["SECERT"] = keys[1];
    process.env["PASSPHRASE"] = keys[2];
    const ctx = new Context();
    new Dydx(ctx).pullTransactionByDatetime(startAt, endAt);
  });
program
  .command("pushTransactionByDatetime <key> <startAt> <endAt>")
  .description("pushTransactionByDatetime")
  .action((key: string, startAt: string, endAt: string) => {
    const keys = key.split("|");
    if (keys.length != 3) {
      throw new Error("KEY|SECERT|PASSPHRASE Format Error");
    }
    process.env["KEY"] = keys[0];
    process.env["SECERT"] = keys[1];
    process.env["PASSPHRASE"] = keys[2];
    const ctx = new Context();
    new Dydx(ctx).pushTransactionByDatetime(startAt, endAt);
  });
program.parse(process.argv);

