import { App } from "./app";

const server: App = new App();
server.app.listen(process.env.PORT, (err?: any) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server Listening on Port ${process.env.PORT}`);
});
