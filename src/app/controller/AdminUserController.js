const Admin = require("../models/Admin");

const Yup = require("yup");

class AdminUserController {
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

    const userExists = await Admin.findOne({
      where: { login: req.body.login },
    });

    if (userExists) res.status(400).json({ error: "Usuário já cadastrado" });

    const { id, login, password } = req.body;

    await Admin.create(req.body);
    console.log(req.body);
    return res.json({
      id,
      login,
      password,
    });
  }
}

export default new AdminUserController();
