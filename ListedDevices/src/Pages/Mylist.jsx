import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { getLocalStorageUser } from "../UTILS/localStorageUtils";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ListService from "../services/listService";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const MyListedDevices = () => {
  const [rows, setRows] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    core: "",
    storage: "",
    ram: "",
    license: "",
  });
  const [editItemData, setEditItemData] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const user_id = getLocalStorageUser().user_id;

  const fetchItems = async () => {
    try {
      const response = await ListService.displaylist(user_id);

      if (response.status === 200) {
        setRows(
          response.data.dislaylist.data.map((fbs) => ({
            list_id: fbs.list_id,
            name: fbs.Name,
            core: fbs.Core,
            storage: fbs.Storage,
            RAM: fbs.RAM,
            license: fbs.License,
          }))
        );
      } else {
        console.error("Invalid response structure", response);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user_id]);

  const handleAddClickOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  const handleSend = async () => {
    const { name, core, storage, ram, license } = newItem;
    if (
      name.trim() !== "" &&
      core.trim() !== "" &&
      storage.trim() !== "" &&
      ram.trim() !== "" &&
      license.trim() !== ""
    ) {
      setLoading(true);
      setOpenBackdrop(true);
      try {
        const response = await ListService.addlist(newItem, user_id);

        if (response.status === 200) {
          const addedItem = {
            list_id: response.data.item.list_id,
            name: response.data.item.Name,
            core: response.data.item.Core,
            storage: response.data.item.Storage,
            RAM: response.data.item.RAM,
            license: response.data.item.License,
          };
          setRows([...rows, addedItem]);
          setNewItem({ name: "", core: "", storage: "", ram: "", license: "" });
          setOpenAdd(false);
          setTimeout(() => {
            setOpenBackdrop(false);
            setSnackbarOpen(true);  
          
              setSnackbarMessage("Item added successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          
          }, 1800);  
          
        } else {
          console.error("Error adding item:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding item:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClickOpen = (id) => {
    setDeleteItemId(id);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setDeleteItemId(null);
  };

  const handleDelete = async () => {
    if (deleteItemId !== null) {
     
      try {
        const response = await ListService.deletelist(user_id, deleteItemId);

        if (response.status === 200) {
          setOpenBackdrop(true);
          setTimeout(() => {
            setOpenBackdrop(false);
            setSnackbarOpen(true);  
         
          setRows(rows.filter((row) => row.list_id !== deleteItemId));
        
          setSnackbarMessage("Item deleted successfully!");
          setSnackbarSeverity("success");
              setSnackbarOpen(true);
            }, 1600);  
         
        } else {
          console.error("Error deleting item:", response.data.message);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      } finally {
        handleDeleteClose();
      }
    }
  };

  const handleEditClickOpen = (item) => {
    setEditItemData({
      list_id: item.list_id,
      name: item.name,
      core: item.core,
      storage: item.storage,
      ram: item.RAM,
      license: item.license,
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEditSave = async () => {
    setLoading(true);
    setOpenBackdrop(true);
    try {
      const response = await ListService.updatelist(editItemData, user_id);
      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.list_id === editItemData.list_id
              ? { ...row, ...editItemData }
              : row
          )
        );
        setTimeout(async () => {
          setOpenBackdrop(false);
          setSnackbarOpen(true);  
         
            await fetchItems(); // Refresh data
            setSnackbarMessage("Item updated successfully!");
            setSnackbarSeverity("success");
           
            setSnackbarOpen(true);
      }, 2000);  
  
        setOpenEdit(false);
       
       
           
         
      } else {
        console.error("Error updating item:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          My Listed Devices
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddClickOpen}
          sx={{ ml: 2 }}
        >
          <AddIcon />
        </Fab>
        <Fab
          variant="extended"
          className="click"
          sx={{
            backgroundColor: "#CD5C5B",
            height: 45,
          }}
          href="/sign-in"
        >
          <h6> logout </h6>
          <MeetingRoomIcon sx={{ ml: 0, mb: 1.2 }} />
        </Fab>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Core</TableCell>
              <TableCell align="right">Storage</TableCell>
              <TableCell align="right">RAM</TableCell>
              <TableCell align="center">License</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.list_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.core}</TableCell>
                <TableCell align="right">{row.storage}</TableCell>
                <TableCell align="right">{row.RAM}</TableCell>
                <TableCell align="right">{row.license}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => handleDeleteClickOpen(row.list_id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() => handleEditClickOpen(row)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Item Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill in the details below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newItem.name}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Core"
            fullWidth
            value={newItem.core}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, core: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Storage"
            fullWidth
            value={newItem.storage}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, storage: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="RAM"
            fullWidth
            value={newItem.ram}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, ram: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="License"
            fullWidth
            value={newItem.license}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, license: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <LoadingButton
            onClick={handleSend}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Add Item
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the details below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editItemData.name || ""}
            onChange={(e) =>
              setEditItemData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Core"
            fullWidth
            value={editItemData.core || ""}
            onChange={(e) =>
              setEditItemData((prev) => ({ ...prev, core: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Storage"
            fullWidth
            value={editItemData.storage || ""}
            onChange={(e) =>
              setEditItemData((prev) => ({ ...prev, storage: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="RAM"
            fullWidth
            value={editItemData.ram || ""}
            onChange={(e) =>
              setEditItemData((prev) => ({ ...prev, ram: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="License"
            fullWidth
            value={editItemData.license || ""}
            onChange={(e) =>
              setEditItemData((prev) => ({ ...prev, license: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <LoadingButton
            onClick={handleEditSave}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this item?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Please confirm your decision.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyListedDevices;
