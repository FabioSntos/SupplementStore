import jwt from "jsonwebtoken";

import Admin from "../models/Admin";
import * as Yup from "yup";
import authConfig from "../../config/auth";

class SessionControler {
  async store(req, res) {
    const schema = await Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: "Falha na validação",
      });
    }

    const { login, password } = req.body;

    const Admnistrator = await Admin.findOne({
      where: { login },
    });
    if (!Admnistrator) {
      return res.status(401).json({
        error: "Usuário inexistente",
      });
    }
    if (!(await Admnistrator.checkPassword(password))) {
      return res.status(401).json({
        error: "Senha incorreta",
      });
    }
    const { id } = Admnistrator;
    return res.json({
      user: {
        login,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionControler();
