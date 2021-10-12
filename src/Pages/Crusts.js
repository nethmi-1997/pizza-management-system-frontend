import React, { useState, useEffect } from 'react'
import { AddCrustModal } from '../Modals/AddCrustModal';
import { ConfirmCrustDeleteModal } from '../Modals/ConfirmCrustDeleteModal'
import { UpdateCrustModal } from '../Modals/UpdateCrustModal'
import CrustService from '../Services/CrustService';
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

//Add Crust 
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

function Crusts() {
    const [showAddCrustModal, setShowAddCrustModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showUpdateCrustModal, setShowUpdateCrustModal] = useState(false);
    const [crusts, setCrusts] = useState([]);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [deleteCrustId, setdeleteCrustId] = useState("");
    const [crustDetails, setCrustDetails] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const openAddCrustModal = () => {
        setShowAddCrustModal(prev => !prev)
    }

    const openConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(prev => !prev)
    }

    const openUpdateCrustModal = () => {
        setShowUpdateCrustModal(prev => !prev)
    }

    const handleDelete = id => {
        setdeleteCrustId(id);
        openConfirmDeleteModal();
    }

    const handleUpdate = async crustDetails => {
        await setCrustDetails(crustDetails)
        await openUpdateCrustModal();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        CrustService.getCrustsList().then(
            response => {
                setCrusts(Object.values(response.data));
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
                    <button onClick={openAddCrustModal}>
                        Add Crust
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
                        {crusts.filter((crust) => {
                            if (searchTerm == ""){
                                return crust
                            } else if (crust.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return crust
                            }
                        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((crust, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Grid container>
                                        <Grid item lg={2}>
                                            <Avatar alt={crust.name} src='.' className={classes.Avatar} />
                                        </Grid>
                                        <Grid item lg={1}/>
                                        <Grid item lg={9}>
                                            <Typography className={classes.Username}> {crust.name}</Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>{crust.smallPrice}</TableCell>
                                <TableCell>{crust.mediumPrice}</TableCell>
                                <TableCell>{crust.largePrice}</TableCell>
                                <TableCell>
                                    {crust.vegan === true ? <span>Veg</span> : <span>Non-Veg</span>}
                                </TableCell>
                                <TableCell>
                                    <button className="form-update" onClick={() => handleUpdate(crust)}>
                                        UPDATE
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <button className="form-delete" onClick={() => handleDelete(crust.id)}>
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
                            count={crusts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
            <AddCrustModal showModal={showAddCrustModal} setShowModal={setShowAddCrustModal} />
            <UpdateCrustModal showModal={showUpdateCrustModal} setShowModal={setShowUpdateCrustModal} crustDetails={crustDetails} />
            <ConfirmCrustDeleteModal showModal={showConfirmDeleteModal} setShowModal={setShowConfirmDeleteModal} id={deleteCrustId} />
            {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
            }
        </div>
    )
}

export default Crusts