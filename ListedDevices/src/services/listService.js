import http from "../http-common";

const addlist = (table, user_id) => {
  return http.post(`/table/additem`, { table, user_id });
};

const updatelist = (table, user_id) => {
  return http.put(`/table/updateitem`, { table, user_id });
};

const deletelist = (user_id, list_id) => {
  return http.delete(`/table/deleteitem`, {
    data: { list_id, user_id },
  });
};

const displaylist = (user_id) => {
  return http.post(`/table/getitems`, { user_id });
};

const ListService = {
  addlist,
  updatelist,
  deletelist,
  displaylist,
};

export default ListService;
