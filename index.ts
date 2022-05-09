import Dydx from "./src/service/dydx";
import Context from "./src/context";
const ctx = new Context();
try {
  const app = new Dydx(ctx);
  app.startTimer()
  process.on("unhandledRejection", (error) => {
    ctx.logger.error("unhandledRejection", error);
  });
} catch (error) {
  ctx.logger.error("application error：", error);
}
