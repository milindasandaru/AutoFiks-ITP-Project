import SparePart from "../models/sparepart.model.js";

export const getSpareParts = async (req, res) => {
  try {
    const spareParts = await SparePart.find();
    res.status(200).json(spareParts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSparePartById = async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart)
      return res.status(404).json({ message: "SparePart not found" });
    res.status(200).json(sparePart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSparePart = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const existsName = await SparePart.findOne({ name: req.body.name });
    if (existsName)
      return res.status(400).json({ message: "SparePart Name already exists" });

    if (req.body.price <= 0)
      return res.status(400).json({ message: "Price must be greater than 0" });

    if (req.body.quantity <= 0)
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });

    // if (!req.body.description)
    //   return res.status(400).json({ message: "Description is required" });

    const sparePart = new SparePart({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      brand: req.body.brand,
      image: image,
    });

    await sparePart.save();
    res.status(201).json(sparePart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSparePart = async (req, res) => {
  try {
    const sparePartId = req.params.id.trim();

    const exists = await SparePart.findById(sparePartId);

    if (!exists) {
      return res.status(404).json({ message: "SparePart not found" });
    }

    if (req.body.price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    if (req.body.quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // if (!req.body.description) {
    //   return res.status(400).json({ message: "Description is required" });
    // }
    const image = req.file ? `/uploads/${req.file.filename}` : exists.image;
    const updatedSparePart = await SparePart.findByIdAndUpdate(
      sparePartId,
      {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description,
        brand: req.body.brand,
        image: image,
      },
      { new: true }
    );

    res.status(200).json(updatedSparePart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSparePart = async (req, res) => {
  try {
    const exists = await SparePart.findById(req.params.id);
    if (!exists)
      return res.status(404).json({ message: "SparePart not found" });
    await SparePart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "SparePart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
