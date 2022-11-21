import bcrypt from "bcrypt";
import {
  registerCollection,
  sessionCollection,
  userCollection,
} from "../database/db.js";
import { v4 as uuidV4 } from "uuid";
import userSchema from "../schemas/userSchemas.js";

async function UserRegistration(req, res) {
  const user = req.body;
  try {
    const userExists = await userCollection.findOne({ email: user.email });
    if (userExists) {
      return res.status(409).send({ message: "Esse email já existe" });
    }
    const { error } = userSchema.validate(user, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }
    if (user.validatePass !== user.password) {
      return res.status(409).send({ message: "Senha incorreta" });
    }
    const hashPassword = bcrypt.hashSync(user.password, 10);
    // console.log(hashPassword);

    const userCreated = await userCollection.insertOne({
      ...user,
      password: hashPassword,
    });
    console.log(userCreated);
    await registerCollection.insertOne({
      userId: userCreated.insertedId,
      registers: [],
    });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function UserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const userExists = await userCollection.findOne({ email });
    if (!userExists) {
      return res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password);

    if (!passwordOk) {
      return res.status(401).send("Senha Incorreta");
    }
    const token = uuidV4();

    await sessionCollection.insertOne({
      token,
      userId: userExists._id,
    });
    console.log(userExists.name);
    res.send({ token, name: userExists.name });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export { UserLogin, UserRegistration };
