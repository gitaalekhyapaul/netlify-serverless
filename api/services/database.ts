import { MongoClient, Db } from "mongodb";
import { CustomError } from "./errorHandler";

export class DatabaseService {
  private client: MongoClient = new MongoClient(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  private database: Db | null = null;

  async connectDb(): Promise<any> {
    try {
      const connection: MongoClient = await this.client.connect();
      this.database = connection.db(process.env.MONGO_DBNAME);
      console.log("Connected to MongoDB!");
    } catch (error) {
      throw error;
    }
  }
  getDb(): Db {
    if (!this.database) {
      throw new CustomError(500, "Unable to connect to MongoDB!");
    } else {
      return this.database;
    }
  }
}
