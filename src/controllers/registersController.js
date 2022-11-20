import { ObjectId } from "mongodb";
import {
  sessionCollection,
  userCollection,
  registerCollection,
} from "../database/db.js";
import registerSchema from "../schemas/registerSchemas.js"



async function GetRegisters(req, res) {
  const token = req.header;

  try {
    // await userCollection.deleteMany({});
    // await sessionCollection.deleteMany({});
    // await registerCollection.deleteMany({});
    const session = await sessionCollection.findOne({ token });

    const user = await userCollection.findOne({ _id: session?.userId });

    if (!user) {
      return res.sendStatus(401);
    }
    delete user.password;

    //const userRegisters = await registerCollection.findOne({userId:user._id})
    const userRegisters = await registerCollection.findOne({userId:user._id});

    console.log(userRegisters);
    res.send(userRegisters.registers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Registro não encontrado");
  }
}

async function PostRegister(req, res) {
  const token = req.header;

  const { value, description, type } = req.body;

  const { error } = registerSchema.validate(value, description, type, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

  try {
    const session = await sessionCollection.findOne({ token });

    const user = await userCollection.findOne({ _id: session.userId });

    registerCollection.updateOne(
      { userId: user._id },
      { $push: { registers: { _id:new ObjectId(),value, description, type} } }
    );

  

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
  }
}

export { GetRegisters, PostRegister };
