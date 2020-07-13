import { Request, Response, NextFunction } from "express";
import { DatabaseService } from "../services/database";
import { Db, Collection, ObjectID } from "mongodb";
import { CustomError } from "../services/errorHandler";

export const postNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dbService: DatabaseService = new DatabaseService();
    await dbService.connectDb();
    const db: Db = dbService.getDb()!;
    const { title, author, content } = req.body;
    const collection: Collection = db.collection("notes");
    const result = await collection.insertOne({
      title,
      author,
      content,
      timestamps: {
        createdAt: new Date(),
      },
    });
    console.log("New Note Created! ID: ", result.ops[0]._id);
    res.status(200).json({
      success: true,
      data: result.ops[0],
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error(error);
      next(new CustomError());
    }
  }
};

export const patchNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dbService: DatabaseService = new DatabaseService();
    await dbService.connectDb();
    const db: Db = dbService.getDb()!;
    const collection: Collection = db.collection("notes");
    const { id, content } = req.body;
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(id) },
      {
        $set: {
          content: content,
        },
        $currentDate: {
          "timestamps.updatedAt": {
            $type: "date",
          },
        },
      }
    );
    if (!result.value) {
      throw new CustomError(404, "Note Not Found!");
    }
    console.log("Updated Note! ID: ", result.value._id);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error(error);
      next(new CustomError());
    }
  }
};

export const deleteNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dbService: DatabaseService = new DatabaseService();
    await dbService.connectDb();
    const db: Db = dbService.getDb()!;
    const collection: Collection = db.collection("notes");
    const id = req.query.id!.toString();
    const result = await collection.findOneAndDelete({ _id: new ObjectID(id) });
    if (!result.value) {
      throw new CustomError(404, "Note Not Found!");
    }
    console.log("Deleted Note! ID: ", result.value._id);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error(error);
      next(new CustomError());
    }
  }
};

export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dbService: DatabaseService = new DatabaseService();
    await dbService.connectDb();
    const db: Db = dbService.getDb()!;
    const collection: Collection = db.collection("notes");
    const { id } = req.query;
    let data: any | any[];
    if (id) {
      const result = await collection.findOne({
        _id: new ObjectID(id.toString()),
      });
      data = result;
    } else {
      const allDocs = await collection.find().toArray();
      data = allDocs;
    }
    console.log(data);
    if (!data || data.length == 0) {
      throw new CustomError(404, "Notes Not Found");
    }
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      console.error(error);
      next(new CustomError());
    }
  }
};
