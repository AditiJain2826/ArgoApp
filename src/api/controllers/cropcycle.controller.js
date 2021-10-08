const {
  CropCycle,
  Field,
  Crop,
  Region,
  Property,
  Organization,
} = require("../models");

exports.list = async (req, res, next) => {
  try {
    const data = await CropCycle.findAll({});
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await CropCycle.findByPk(req.params.id);
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
    const { fieldId, cropId, startmonth, endmonth, startyear, endyear } =
      req.body;
    if (fieldId && cropId && startmonth && endmonth && startyear && endyear) {
      const fieldData = await getFieldData(fieldId, req.user.id);
      const cropData = await Crop.findByPk(cropId);
      if (!fieldData || !cropData || startyear > endyear) {
        res.sendStatus(400);
      } else {
        const data = await CropCycle.create({
          fieldId: fieldId,
          CropId: cropId,
          startmonth,
          endmonth,
          startyear,
          endyear,
        });
        res.status(201).json(data);
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
    const cropcycleExist = await doesCropCycleExists(
      req.params.id,
      req.user.id
    );
    if (cropcycleExist) {
      const { startmonth, endmonth, startyear, endyear } = req.body;
      if (startmonth || endmonth || startyear || endyear) {
        const data = await CropCycle.update(req.body, {
          where: { id: req.params.id },
        });
        if (data[0] === 1) {
          res.status(201).send({ message: "Updated successfully!" });
        } else {
          res.status(404).json({ message: "Not Found" });
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
    const cropcycleExists = await doesCropCycleExists(
      req.params.id,
      req.user.id
    );
    if (cropcycleExists) {
      const data = await CropCycle.destroy({
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

const doesCropCycleExists = async (cropcycleId, userId) => {
  const data = await CropCycle.findOne({
    where: { id: cropcycleId },
    include: [
      {
        model: Field,
        required: true,
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
                    where: { UserId: userId },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return data ? true : false;
};

const getFieldData = async (fieldId, userid) => {
  return await Field.findOne({
    where: { id: fieldId },
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
                where: { UserId: userid },
              },
            ],
          },
        ],
      },
    ]
  });
};