import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { IUserLogin } from "../../interfaces/users";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { AppError } from "../../errors/AppErros";
import "dotenv/config";

const sessionLoginService = async ({
  email,
  password,
}: IUserLogin): Promise<string> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 403);
  if (!user.isActive) throw new AppError("User is not active");

  const matchPassword = await compare(password, user.password);
  if (!matchPassword) throw new AppError("Invalid credentials", 403);

  const token = jwt.sign(
    { isAdm: user.groupUser.id, id: user.id },
    String(process.env.JWT_SECRET),
    { expiresIn: "1d" }
  );

  return token;
};

export default sessionLoginService;
