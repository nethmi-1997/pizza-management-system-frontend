import React, { useState, useEffect } from 'react'
import { AddOrderModal } from '../Modals/AddOrderModal';
import { ConfirmOrderDeleteModal } from '../Modals/ConfirmOrderDeleteModal'
import { UpdateOrderModal } from '../Modals/UpdateOrderModal'
import OrderService from '../Services/OrderService';
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

function Orders() {
    const [showAddOrderModal, setShowAddOrderModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showUpdateOrderModal, setShowUpdateOrderModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [deleteOrderId, setdeleteOrderId] = useState("");
    const [orderDetails, setOrderDetails] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const openAddOrderModal = () => {
        setShowAddOrderModal(prev => !prev)
    }

    const openConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(prev => !prev)
    }

    const openUpdateOrderModal = () => {
        setShowUpdateOrderModal(prev => !prev)
    }

    const handleDelete = id => {
        setdeleteOrderId(id);
        openConfirmDeleteModal();
    }

    const handleUpdate = async orderDetails => {
        await setOrderDetails(orderDetails)
        await openUpdateOrderModal();
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        OrderService.getUndeliveredOrdersList().then(
            response => {
                setOrders(Object.values(response.data));
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
                    <button onClick={openAddOrderModal}>
                        Add Order
                    </button>
                </div>
                <div className="BodyWindowTopRight" style={{ width: '250px' }}>
                    <SearchIcon/>
                    <input 
                        style={{ width: '200px' }}
                        type="text"
                        placeholder="Search by Customer Name"
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
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'80px' }}>
                                    Order ID
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'0px' }}>
                                    Customer Name
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'30px' }}>
                                    Customer Address
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Amount
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell}/>
                                <TableCell className={classes.TableHeaderCell}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {orders.filter((order) => {
                            if (searchTerm == ""){
                                return order
                            } else if (order.customerName.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return order
                            }
                        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                            <TableRow key={index}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.amount}.00</TableCell>
                                <TableCell>
                                    <button className="form-update" onClick={() => handleUpdate(order)}>
                                        UPDATE
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <button className="form-delete" onClick={() => handleDelete(order.id)}>
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
                            count={orders.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
            <AddOrderModal showModal={showAddOrderModal} setShowModal={setShowAddOrderModal} />
            <UpdateOrderModal showModal={showUpdateOrderModal} setShowModal={setShowUpdateOrderModal} orderDetails={orderDetails} />
            <ConfirmOrderDeleteModal showModal={showConfirmDeleteModal} setShowModal={setShowConfirmDeleteModal} id={deleteOrderId} />
            {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
            }
        </div>
    )
}

export default Orders
