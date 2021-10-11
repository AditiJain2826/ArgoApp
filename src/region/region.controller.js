const { Region, Property, Organization, Field } = require("../database/database.schema");

exports.list = async (req, res, next) => {
  try {
    const properties = await Region.findAll({
      include: [
        {
          model: Property,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Organization,
              required: false,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              where: { UserId: req.user.id },
            },
          ],
        },
      ],
    });
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Region.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Property,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: Organization,
              required: true,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              where: { UserId: req.user.id },
            },
          ],
        },
        {
          model: Field,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
    const { name, PropertyId } = req.body;
    if (name && PropertyId) {
      const propertyData = await getPropertyData(PropertyId, req.user.id);
      if (!propertyData) {
        res.status(404).json({ message: "property not found" });
      } else {
        const nameExists = await getRegionByName(req.body.name);
        if (!nameExists) {
          let data = await Region.create(req.body);
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
    const regionExists = await doesRegionExists(req.params.id, req.user.id);
    if (regionExists) {
      const { name, PropertyId } = req.body;
      if (name || PropertyId) {
        const propertyData = PropertyId
          ? await getPropertyData(PropertyId, user.req.id)
          : true;
        if (!propertyData) {
          res.status(404).json({ message: "Property not found" });
        } else {
          const data = await Region.update(req.body, {
            where: { id: req.params.id },
          });
          if (data[0] === 1) {
            res.status(201).send({ message: "Updated successfully!" });
          } else {
            res.status(404).json({ message: "Not Found" });
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
    const regionExists = await doesRegionExists(req.params.id, req.user.id);
    if (regionExists) {
      const data = await Region.destroy({
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

const doesRegionExists = async (regionId, userId) => {
  const data = await Region.findOne({
    where: { id: regionId },
    include: [
      {
        model: Property,
        required: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Organization,
            required: true,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: { UserId: userId },
          },
        ],
      },
    ],
  });
  return data ? true : false;
};

const getPropertyData = async (PropertyId, userid) => {
  return await Property.findOne({
    where: { id: PropertyId },
    include: [
      {
        model: Organization,
        required: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "UserId"],
        },
        where: { UserId: userid },
      },
    ],
    attributes: ["name", "id"],
  });
};

const getRegionByName = async (name) => {
  return await Region.findOne({
    where: { name: name },
  });
};
