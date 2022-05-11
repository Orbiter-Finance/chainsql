import fs from "fs";
import { Socket, connect, createServer, Server } from "net";
import { Logger } from "winston";

const pipeFile =
  process.platform === "win32" ? "\\\\.\\pipe\\mypip" : "./runtime/unix.sock";

export class Net {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }
  createClient() {
    const client = connect(pipeFile);
    client.on("connect", () => {
      this.logger.info("[Client] MsgNotify Client Connect Success");
    });
    client.on("end", () => {
      this.logger.error("[Client] MsgNotify Client Disconnected");
    });
    client.on("error", (error) => {
      this.logger.error("[Client] MsgNotify Client Error", error);
    });
    client.on("data", (data) => console.log(`receive: ${data}`));
    return client;
  }
  async createServer(callback: any): Promise<Server> {
    try {
      fs.unlinkSync(pipeFile);
    } catch (error) {}
    const server = await createServer((conn: Socket) => {
      console.log("[Server] socket connected.");
      conn.on("close", () => {
        this.logger.info("[Server] MsgNotift Server Close");
      });
      conn.on("data", (data) => {
        callback(data);
      });
      conn.on("error", (error) => {
        this.logger.error("[Server] MsgNotify Server Error", error);
      });
    });

    server.listen(pipeFile);
    return server;
  }
}
