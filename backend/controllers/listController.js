const {
  displayItem,
  deleteItem,
  updateItem,
  insertItem,
} = require("../services/listServices");

const insertItemController = async (req, res) => {
  const { user_id } = req.body;
  const { name, core, storage, ram, license } = req.body.table;
  if (!name && !core && !storage && !ram && !license) {
    return res.status(400).json({ message: "Nothing to be inserted" });
  }

  try {
    const result = await insertItem(name, core, storage, ram, license, user_id);
    if (result.status === 200) {
      return res.status(200).json({
        message: "Item added successfully",
        item: {
          list_id: result.insertID,
          Name: name,
          Core: core,
          Storage: storage,
          RAM: ram,
          License: license,
          user_id: user_id,
        },
      });
    } else {
      return res.status(401).json({ message: "Failed to add item" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateItemController = async (req, res) => {
  const { user_id } = req.body;
  const { name, core, storage, ram, license, list_id } = req.body.table;
  if (!name && !core && !storage && !ram && !license) {
    return res.status(400).json({ message: "There's nothing to be updated" });
  }

  const updateFields = {};

  if (name) updateFields.name = name;
  if (core) updateFields.core = core;
  if (storage) updateFields.storage = storage;
  if (ram) updateFields.ram = ram;
  if (license) updateFields.license = license;

  try {
    const result = await updateItem(updateFields, user_id, list_id);
    if (result.status === 200) {
      return res.status(200).json({
        message: "Item added successfully",
      });
    } else {
      return res.status(401).json({ message: "Failed to add item" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteItemController = async (req, res) => {
  const { list_id, user_id } = req.body;

  try {
    const result = await deleteItem(user_id, list_id);

    if (result.status === 200) {
      return res.status(200).json({
        message: "Item deleted successfully",
        deletelist: result.deletelist,
      });
    } else if (result.status === 401) {
      return res.status(401).json({ message: "Item is not deleted" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const displayItemController = async (req, res) => {
  const { user_id } = req.body;

  try {
    const dislaylist = await displayItem(user_id);
    if (dislaylist.status === 200) {
      return res.status(200).json({
        message: "Successfully displayed items",
        dislaylist: dislaylist,
      });
    } else {
      return { status: 401, message: "nothing to be displayed" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

module.exports = {
  displayItemController,
  deleteItemController,
  updateItemController,
  insertItemController,
};
