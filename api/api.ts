import { App } from "./app";
import serverless from "serverless-http";

const expressApp: App = new App();
exports.handler = serverless(expressApp.app);
