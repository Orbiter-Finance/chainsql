import DydxService from "./src/service/dydx";
import Context from "./src/context";
import { NetServerInit } from "./src/NetServer";
const ctx = new Context();
try {
  const dydxService = new DydxService(ctx);
  NetServerInit(ctx,dydxService);
  dydxService.startTimer();
  process.on("unhandledRejection", (error:Error) => {
    ctx.logger.error("unhandledRejection: ", error.message);
  });
} catch (error) {
  ctx.logger.error("application error: ", error);
}
