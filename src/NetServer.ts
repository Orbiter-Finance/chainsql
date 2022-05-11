import { set } from "lodash";
import { Net } from "../bin/net";
import Context from "./context";
import DydxService from "./service/dydx";
import { CMDOpType } from "./types";

export function NetServerInit(ctx: Context,service:DydxService) {
  new Net(ctx.logger).createServer((data: string) => {
    const body = JSON.parse(data);
    switch (body["method"]) {
      case CMDOpType.InjectionConfiguration:
        for (const k in body["data"]) {
          set(ctx.config.dydx, k, body["data"][k]);
        }
        break;
      case CMDOpType.PullTransaction:
        service.pullTransactionByDatetime(
          Number(body["data"]["startTime"]) * 1000,
          Number(body["data"]["endTime"] * 1000)
        );
        break;
      case CMDOpType.PullTransaction:
        service.pushTransactionByDatetime(
          Number(body["data"]["startTime"]) * 1000,
          Number(body["data"]["endTime"] * 1000)
        );
        break;
    }
  });
}
