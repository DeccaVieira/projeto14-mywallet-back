import {sessionCollection, userCollection, registerCollection, registerSchema, userSchema } from "../index.js"
async function GetRegisters(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const registers = await registerCollection
      .find()
      .sort({ _id: -1 })
      .toArray();
    res.send(registers);
    // const session = await sessionCollection.findOne({ token });

    // const user = await userCollection.findOne({ _id: session?.userId });
    console.log(user);
    if (!user) {
      return res.sendStatus(401);
    }
    delete user.password;

    res.send({ registers });
  } catch (err) {
    console.log(err);
    res.status(500).send("Registro não encontrado");
  }
}

async function PostRegister(req, res) {
  const { authorization } = req.headers;
  const { value, description, type } = req.body;

  const token = authorization?.replace("Bearer", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = sessionCollection.findOne({ token });
    const user = userCollection.findOne({ _id: session.userId });

    console.log(user);
    res.sendStatus(201);

    console.log(session, "session");
    await registerCollection.insertOne({ value, description, type: "outflow" });
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
  }
}

export { GetRegisters, PostRegister };
