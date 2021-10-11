const { Field, Region, Property, Organization } = require("../database/database.schema");

exports.list = async (req, res, next) => {
  try {
    const data = await Field.findAll({
      include: [
        {
          model: Region,
          required: true,
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
          ],
        },
      ],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Field.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Region,
          required: false,
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
    const { name, RegionId, size, position } = req.body;
    if (name && RegionId && size && position) {
      const regionData = await getRegionData(RegionId, req.user.id);
      if (!regionData) {
        res.status(404).json({ message: "region not found" });
      } else {
        const nameExists = await getFieldByName(req.body.name);
        if (!nameExists) {
          const data = await Field.create(req.body);
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
    const fieldExists = await doesFieldExists(req.params.id, req.user.id);
    if (fieldExists) {
      const { name, RegionId, size, position } = req.body;
      if (name || RegionId || size || position) {
        const regionData = RegionId
          ? await getRegionData(RegionId, user.req.id)
          : true;
        if (!regionData) {
          res.status(404).json({ message: "region not found" });
        } else {
          const data = await Field.update(req.body, {
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
    const fieldExist = await doesFieldExists(req.params.id, req.user.id);
    if (fieldExist) {
      const data = await Field.destroy({
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

const doesFieldExists = async (regionId, userId) => {
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

const getRegionData = async (RegionId, userid) => {
  return await Region.findOne({
    where: { id: RegionId },
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
            where: { UserId: userid },
          },
        ],
      },
    ],
  });
};

const getFieldByName = async (name) => {
  return await Field.findOne({
    where: { name: name },
  });
};