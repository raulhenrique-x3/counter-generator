import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../model/User";
import { generateAccessToken, generateRefreshToken } from "../../util/jwt";
import { IUser } from "../../types/user";
import { RequestWithUserRole } from "../../middleware/auth/Jwt";

class UserController {
  public async register(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, username, phone, password }: IUser =
        req.body;
      const searchEmail = await User.findOne({ email });

      if (searchEmail) {
        return res.status(400).send({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const saveUser = new User({
        first_name,
        last_name,
        email,
        username,
        phone,
        password: hashedPassword,
      });

      await saveUser.save();

      return res.status(200).send({ message: "User successfully created!" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Please fill in all fields correctly" });
      }

      const userVerify = await User.findOne<Promise<IUser>>({ email: email });

      if (!userVerify) {
        return res.status(404).send({ message: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, userVerify.password);

      if (userVerify && validPassword) {
        const token = generateAccessToken(userVerify?.id);
        const refresh_token = generateRefreshToken(userVerify?.id);

        return res.status(200).send({
          token,
          refresh_token,
        });
      } else {
        return res.status(401).send({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async getOwnUser(req: RequestWithUserRole, res: Response) {
    try {
      const { id } = req.user;

      const searchUser = await User.findById(id, { password: 0 });
      return res.status(200).send(searchUser);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async getUserAllData(req: RequestWithUserRole, res: Response) {
    try {
      const { id } = req.user;
      const user = await User.findById(id, { password: 0 });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async editUser(req: RequestWithUserRole, res: Response) {
    try {
      const { first_name, last_name, email, username, phone }: IUser = req.body;
      const { id } = req.user;
      const { picture }: any = req.file ? req.file : "";
      const searchUser = await User.findByIdAndUpdate(id, {
        first_name,
        last_name,
        email,
        username,
        phone,
        picture,
      });
      searchUser?.save();

      if (!searchUser) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send({ message: "User successfully updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async deleteUser(req: RequestWithUserRole, res: Response) {
    try {
      const { id } = req.user;
      const { password } = req.body;

      if (!password) {
        return res.status(400).send({ message: "Fill the fields correctly" });
      }

      const searchUser = await User.findById(id);

      if (!searchUser) {
        return res.status(404).send({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        searchUser.password
      );

      if (!isPasswordValid) {
        return res.status(400).send({ message: "Wrong email or password" });
      }

      await User.findByIdAndDelete(id);
      return res.status(200).send({ message: "Success" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async changePassword(req: RequestWithUserRole, res: Response) {
    try {
      const { id } = req.user;
      const { password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(id, { password: hashedPassword });

      return res.status(200).send({ message: "Success" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async getAllUsers(req: RequestWithUserRole, res: Response) {
    try {
      const users = await User.find({}, { password: 0 });
      return res.status(200).send(users);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default new UserController();
