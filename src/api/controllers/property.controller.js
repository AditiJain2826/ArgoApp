const {
  Property,
  Organization,
  Region,
  Field,
  CropCycle,
} = require("../models");

exports.list = async (req, res, next) => {
  try {
    const properties = await Property.findAll({
      include: [
        {
          model: Organization,
          required: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "UserId"],
          },
          where: { UserId: req.user.id },
        },
      ],
      attributes: ["name", "id"],
    });
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Property.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Organization,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: { UserId: req.user.id },
        },
        {
          model: Region,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Field,
              required: false,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });
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

exports.getCropCycleById = async (req, res, next) => {
  try {
    const data = await Property.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Region,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Field,
              required: true,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: [
                {
                  model: CropCycle,
                  required: false,
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                  as: "field",
                },
              ],
            },
          ],
        },
      ],
    });
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
    const { name, OrganizationId } = req.body;
    if (name && OrganizationId) {
      const organizationData = await Organization.findOne({
        where: { UserId: req.user.id, id: OrganizationId },
      });
      if (!organizationData) {
        res.status(404).json({ message: "Organization not found" });
      } else {
        const nameExists = await getPropertyByName(req.body.name);
        if (!nameExists) {
          let data = await Property.create(req.body);
          res.status(201).json(data);
        } else {
          res.status(409).json({ message: "Name already exists." });
        }
      }
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.update = async (req, res, next) => {
  try {
    const propertyExists = await doesPropertyExists(req.params.id, req.user.id);
    if (propertyExists) {
      const { name, OrganizationId } = req.body;
      if (name || OrganizationId) {
        const organizationData = OrganizationId
          ? await Organization.findOne({
              where: { UserId: req.user.id, id: OrganizationId },
            })
          : true;
        if (!organizationData) {
          res.status(404).json({ message: "Organization not found" });
        } else {
          const nameExists = await getPropertyByName(req.body.name);
          if (!nameExists) {
            const data = await Property.update(req.body, {
              where: { id: req.params.id },
            });
            if (data[0] === 1) {
              res.status(201).send({ message: "Updated successfully!" });
            } else {
              res.status(404).json({ message: "Not Found" });
            }
          } else {
            res.status(409).json({ message: "Name already exists." });
          }
        }
      } else {
        res.sendStatus(400);
      }
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
    const propertyExists = await doesPropertyExists(req.params.id, req.user.id);
    if (propertyExists) {
      const data = await Property.destroy({
        where: { id: req.params.id },
      });
      if (data === 1) {
        res.status(200).send({ message: "Deleted successfully!" });
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const doesPropertyExists = async (propertyId, userId) => {
  const data = await Property.findOne({
    where: { id: propertyId },
    include: [
      {
        model: Organization,
        required: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { UserId: userId },
      },
    ],
  });
  return data ? true : false;
};

const getPropertyByName = async (name) => {
  return await Property.findOne({
    where: { name: name },
  });
};
