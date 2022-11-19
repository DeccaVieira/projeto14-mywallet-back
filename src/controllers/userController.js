import bcrypt from "bcrypt";
import {userSchema, sessionCollection, userCollection} from "../index.js" 

async function UserLogin(req, res) {
  const user = req.body;

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
  console.log(hashPassword);

  try {
    await userCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

async function UserRegistration(req, res) {
  const { email, password } = req.body;

  try {
    const userExists = await userCollection.findOne({ email });
    if (!userExists) {
      res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password);

    if (!passwordOk) {
      return res.sendStatus(401);
    }

    await sessionCollection.insertOne({
      token,
      userId: userExists._id,
    });
    res.send({ token });
    console.log(token, "sign-in");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export { UserLogin, UserRegistration };
