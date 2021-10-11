const { Crop } = require("../database/database.schema");

exports.list = async (req, res, next) => {
  try {
    const data = await Crop.findAll({
      attributes: ["name", "id"],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Crop.findByPk(req.params.id);
    if (data) {
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
    const data = await Crop.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Crop.update(req.body, {
      where: { id: req.params.id },
    });
    if (data[0] === 1) {
      res.status(201).send({ message: "Updated successfully!" });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Crop.destroy({
      where: { id: req.params.id },
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
