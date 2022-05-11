import { set } from "lodash";
import { Net } from "../bin/net";
import Context from "./context";
import DydxService from "./service/dydx";
import { CMDOpType } from "./types";
import {Socket} from 'net';

export function NetServerInit(ctx: Context,service:DydxService) {
  return new Net(ctx.logger).createServer(async(conn:Socket, data: string) => {
    const body = JSON.parse(data);
    let response:any;
    switch (body["method"]) {
      case CMDOpType.InjectionConfiguration:
        for (const k in body["data"]) {
          set(ctx.config.dydx, k, body["data"][k]);
        }
        response = `✅ Injection Config [${Object.keys(body["data"])}] SUCCESS`;
        break;
      case CMDOpType.PullTransaction:
        response = await service.pullTransactionByDatetime(
          Number(body["data"]["startTime"]) * 1000,
          Number(body["data"]["endTime"] * 1000)
        );
        break;
      case CMDOpType.PullTransaction:
        response = await service.pushTransactionByDatetime(
          Number(body["data"]["startTime"]) * 1000,
          Number(body["data"]["endTime"] * 1000)
        );
        break;
    }
    if (response) {
      conn.write(response);
    }
  });
}
