import { ObjectId } from "mongodb";
import {
  sessionCollection,
  userCollection,
  registerCollection,
} from "../database/db.js";
import registerSchema from "../schemas/registerSchemas.js";

async function GetRegisters(req, res) {
  const { token } = res.locals;
  console.log(token);

  try {
    const session = await sessionCollection.findOne({ token });

    const user = await userCollection.findOne({ _id: session?.userId });

    if (!user) {
      return res.sendStatus(401);
    }
    delete user.password;

    const userRegisters = await registerCollection.findOne({
      userId: user._id,
    });

    console.log(userRegisters);

    const result = userRegisters.registers.reverse();
    res.send(result);
    console.log(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Registro não encontrado");
  }
}

async function PostRegister(req, res) {
  const { token } = res.locals;
  console.log(token);
  const { value, description, type } = req.body;

  const { error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    console.log(token);
    const session = await sessionCollection.findOne({ token });
    console.log(session);
    const user = await userCollection.findOne({ _id: session.userId });
    console.log(user);
    let today = new Date();
    let date = today.getDate() + "/" + parseInt(today.getMonth() + 1);
    console.log(date);

    registerCollection.updateOne(
      { userId: user._id },
      {
        $push: {
          registers: {
            _id: new ObjectId(),
            day: date,
            value,
            description,
            type,
          },
        },
      }
    );

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
  }
}

export { GetRegisters, PostRegister };
