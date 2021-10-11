const {
  Organization,
  Property,
  Region,
  Field,
} = require("../database/database.schema");

exports.list = async (req, res, next) => {
  try {
    const organizations = await Organization.findAll({
      where: { UserId: req.user.id },
      attributes: ["name", "id"],
    });
    res.json(organizations);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Organization.findAll({
      where: { id: req.params.id, UserId: req.user.id },
      include: [
        {
          model: Property,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Region,
              required: false,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: [
                {
                  model: Field,
                  required: true,
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                },
              ],
            },
          ],
        },
      ],
    });
    if (data[0]) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.create = async (req, res, next) => {
  try {
    const nameExists = await getOrganizationByName(req.body.name);
    if (!nameExists) {
      const data = await Organization.create({
        name: req.body.name,
        UserId: req.user.id,
      });
      res.status(201).json(data);
    } else {
      res.status(409).json({ message: "Name already exists." });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.update = async (req, res, next) => {
  try {
    const nameExists = await getOrganizationByName(req.body.name);
    if (!nameExists) {
      const data = await Organization.update(
        { name: req.body.name },
        {
          where: { id: req.params.id, UserId: req.user.id },
        }
      );
      if (data[0] === 1) {
        res.status(201).send({ message: "Updated successfully!" });
      } else {
        res.send(404).json({ message: "Not Found" });
      }
    } else {
      res.status(409).json({ message: "Name already exists." });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Organization.destroy({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (data === 1) {
      res.status(200).send({ message: "Deleted successfully!" });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getOrganizationByName = async (orgname) => {
  return await Organization.findOne({
    where: { name: orgname },
  });
};