import React, { useState, useEffect } from 'react'
import { AddToppingModal } from '../Modals/AddToppingModal';
import { ConfirmToppingDeleteModal } from '../Modals/ConfirmToppingDeleteModal'
import { UpdateToppingModal } from '../Modals/UpdateToppingModal'
import ToppingService from '../Services/ToppingService';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Avatar, Grid, TableFooter, TablePagination, Typography } from '@material-ui/core';
import FlashMessage from '../Components/FlashMessage';
import SearchIcon from '@material-ui/icons/Search';

//CREATED SEARCH FIELD FOR TOPPINGS
const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    TableContainer: {
        borderRadius: 15
    },
    TableHeaderCell: {
        fontWeight: 'bold',
        backgroundColor: '#192435',
        color: 'white',
        paddingLeft: '60px'
    },
    Avatar: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.getContrastText(theme.palette.primary.light)
    },
    Username: {
        paddingTop: '8px'
    }
  }));

function Toppings() {
    const [showAddToppingModal, setShowAddToppingModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showUpdateToppingModal, setShowUpdateToppingModal] = useState(false);
    const [toppings, setToppings] = useState([]);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [deleteToppingId, setdeleteToppingId] = useState("");
    const [toppingDetails, setToppingDetails] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const openAddToppingModal = () => {
        setShowAddToppingModal(prev => !prev)
    }

    const openConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(prev => !prev)
    }

    const openUpdateToppingModal = () => {
        setShowUpdateToppingModal(prev => !prev)
    }

    const handleDelete = id => {
        setdeleteToppingId(id);
        openConfirmDeleteModal();
    }

    const handleUpdate = async toppingDetails => {
        await setToppingDetails(toppingDetails)
        await openUpdateToppingModal();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        ToppingService.getToppingsList().then(
            response => {
                setToppings(Object.values(response.data));
            },
            error => {
                console.log(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    })

    const classes = useStyles();

    return (
        <div className="BodyWindow">
            <div className="BodyWindowTop">
                <div className="BodyWindowTopLeft">
                    <button onClick={openAddToppingModal}>
                        Add Topping
                    </button>
                </div>
                <div className="BodyWindowTopRight">
                    <SearchIcon/>
                    <input 
                        type="text"
                        placeholder="Search by Name"
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                        }}
                     />
                </div>
            </div>
            <div className="BodyWindowBottom">
                <TableContainer component={Paper} className={classes.TableContainer}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'140px' }}>
                                    Name
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'0px' }}>
                                    Small Price
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'0px' }}>
                                    Medium Price
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'0px' }}>
                                    Large Price
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'20px' }}>
                                    Type
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell}/>
                                <TableCell className={classes.TableHeaderCell}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {toppings.filter((topping) => {
                            if (searchTerm == ""){
                                return topping
                            } else if (topping.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return topping
                            }
                        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((topping, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Grid container>
                                        <Grid item lg={2}>
                                            <Avatar alt={topping.name} src='.' className={classes.Avatar} />
                                        </Grid>
                                        <Grid item lg={1}/>
                                        <Grid item lg={9}>
                                            <Typography className={classes.Username}> {topping.name}</Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>{topping.smallPrice}</TableCell>
                                <TableCell>{topping.mediumPrice}</TableCell>
                                <TableCell>{topping.largePrice}</TableCell>
                                <TableCell>
                                    {topping.vegan === true ? <span>Veg</span> : <span>Non-Veg</span>}
                                </TableCell>
                                <TableCell>
                                    <button className="form-update" onClick={() => handleUpdate(topping)}>
                                        UPDATE
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <button className="form-delete" onClick={() => handleDelete(topping.id)}>
                                        DELETE
                                    </button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                        <TablePagination
                            rowsPerPageOptions={[4, 6, 8]}
                            component="div"
                            count={toppings.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
            <AddToppingModal showModal={showAddToppingModal} setShowModal={setShowAddToppingModal} />
            <UpdateToppingModal showModal={showUpdateToppingModal} setShowModal={setShowUpdateToppingModal} toppingDetails={toppingDetails} />
            <ConfirmToppingDeleteModal showModal={showConfirmDeleteModal} setShowModal={setShowConfirmDeleteModal} id={deleteToppingId} />
            {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
            }
        </div>
    )
}

export default Toppings