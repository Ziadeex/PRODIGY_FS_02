const { query } = require("../database/db");
const { use } = require("../routes/listRoute");

const insertItem = async (name, core, storage, ram, license, user_id) => {
  const sql = `INSERT INTO laptoplists (Name, Core, Storage, RAM, License, user_id) VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    const addlist = await query(sql, [
      name,
      core,
      storage,
      ram,
      license,
      user_id,
    ]);
    if (addlist.affectedRows) {
      return { status: 200, message: "Successful", insertID: addlist.insertId };
    } else {
      return { status: 401, message: "item isn't inserted" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

const updateItem = async (updateFields, user_id, list_id) => {
  let sql =
    "UPDATE laptoplists SET Name = ?, Core = ?, Storage = ?, RAM = ?, License = ? WHERE list_id = ? AND user_id = ?";

  try {
    const updatelist = await query(sql, [
      updateFields.name,
      updateFields.core,
      updateFields.storage,
      updateFields.ram,
      updateFields.license,
      list_id,
      user_id,
    ]);
    if (updatelist.affectedRows) {
      return { status: 200, message: "Successful" };
    } else {
      return { status: 401, message: "Item isn't updated" };
    }
  } catch (error) {
    return { status: 500, message: "Internal error" };
  }
};

const deleteItem = async (user_id, list_id) => {
  const sql = "DELETE FROM laptoplists WHERE user_id = ? AND list_id = ?";

  try {
    const deletelist = await query(sql, [user_id, list_id]);
    if (deletelist.affectedRows) {
      return { status: 200, message: "Successful", data: deletelist };
    } else {
      return { status: 401, message: "Item is not deleted" };
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal error" };
  }
};

const displayItem = async (user_id) => {
  const sql = `SELECT * FROM laptoplists WHERE user_id = ?;`;

  try {
    const dislaylist = await query(sql, user_id);
    if (dislaylist.length > 0) {
      return { status: 200, message: "Successful", data: dislaylist };
    } else {
      return { status: 401, message: "nothing to be displayed" };
    }
  } catch (error) {
    return { status: 500, message: "internal error" };
  }
};

module.exports = {
  displayItem,
  deleteItem,
  updateItem,
  insertItem,
};
