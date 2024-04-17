import prisma from "../db/prisma.js";
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";

const findUser = async (req, res) => {
  const { userId } = req.params;
  let { role } = req.params;

  if (!userId || !role)
    return res
      .status(400)
      .json(responseBody("failed", "Missing parameters", 400, null));

  role = roleSelection(role);

  try {
    const user = await prisma[`${role}`].findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json(responseBody("failed", "user not found", 404, null));
    }
    delete user.Password;

    return res
      .status(200)
      .json(responseBody("success", "user found", 200, { user }));
  } catch (error) {
    console.log("err", error);
    return res
      .status(500)
      .json(responseBody("failed", "internal server error", 500, null));
  }
};

export default findUser;
