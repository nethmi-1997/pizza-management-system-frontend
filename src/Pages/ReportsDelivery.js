import React, { useState, useEffect } from 'react'
import userService from '../Services/UserService';
import { AddOrderModal } from '../Modals/AddOrderModal';
import { ConfirmOrderDeleteModal } from '../Modals/ConfirmOrderDeleteModal'
import { UpdateOrderModal } from '../Modals/UpdateOrderModal'
import OrderService from '../Services/OrderService';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
import moment from 'moment';
// import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import generatePDF from '../Reports/orderReportGenerator'
import { green } from '@material-ui/core/colors';
import TextField from "@material-ui/core/TextField";
import PrintIcon from '@material-ui/icons/Print';
import Tooltip from '@material-ui/core/Tooltip';

const CssTextField = withStyles({
    root: {
      "& .MuiIconButton-root": {
        color: 'white' 
      },
      "& .MuiInputBase-inputAdornedEnd": {
        color: 'white' 
      },
      "& .MuiInputLabel-formControl": {
        color: 'white'
      }
    }
  })(TextField);

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
    },
    KeyboardDatePicker: {
        color: 'green'
    }
  }));

function ReportsDelivery() {
    const [content, setContent] = useState("");
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
    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date('2021-09-01T00:00:00'));
    const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());
    const [filteredReports, setFilteredReports] = useState([]);

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

    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
        console.log(moment(selectedStartDate).format('DD MMM YYYY'));
      };

      const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
        console.log(selectedEndDate);
      };

    useEffect(() => {
        OrderService.getDeliveredOrdersList().then(
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
                <div className="BodyWindowTopLeftReport">
                    <SearchIcon/>
                        <input 
                            style={{ width: '200px' }}
                            type="text"
                            placeholder="Search by Order ID"
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                            }}
                        />
                </div>
                <div className="BodyWindowTopRightReport">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justifyContent="space-around">
                            <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="From"
                            value={selectedStartDate}
                            onChange={handleStartDateChange}
                            TextFieldComponent={CssTextField}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="To"
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
                            TextFieldComponent={CssTextField}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <button onClick={() => generatePDF(
                        orders.filter((order) => {
                            if (searchTerm == ""){
                                return order
                            } else if (order.id.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return order
                            }
                        }).filter((order) => {
                            if ((new Date(order.orderTimestamp) - new Date(selectedStartDate) >= 0) &&
                                (new Date(order.orderTimestamp) - new Date(selectedEndDate) <= 0)) {
                                    return order
                            }
                        })
                    , "save")}>
                        Download Report
                    </button>
                    <Tooltip title="Download Report">
                    <button 
                        style={{ width:'60px', paddingTop: '7px', paddingBottom: '3px' }}
                        onClick={() => generatePDF(
                            orders.filter((order) => {
                                if (searchTerm == ""){
                                    return order
                                } else if (order.id.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                    return order
                                }
                            }).filter((order) => {
                                if ((new Date(order.orderTimestamp) - new Date(selectedStartDate) >= 0) &&
                                    (new Date(order.orderTimestamp) - new Date(selectedEndDate) <= 0)) {
                                        return order
                                }
                            })
                        , "print")}>
                        <PrintIcon />
                    </button>
                    </Tooltip>
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
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Amount
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'25px' }}>
                                    Rider
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Order Date
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Order Time
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Delivery Time
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {orders.filter((order) => {
                            if (searchTerm == ""){
                                return order
                            } else if (order.id.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return order
                            }
                        }).filter((order) => {
                            if ((new Date(order.orderTimestamp) - new Date(selectedStartDate) >= 0) &&
                                (new Date(order.orderTimestamp) - new Date(selectedEndDate) <= 0)) {
                                    return order
                            }
                        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                            <TableRow key={index}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.amount + '.00'}</TableCell>
                                <TableCell>{order.deliveryRider}</TableCell>
                                <TableCell>{moment(order.orderTimestamp).format('DD MMM YYYY')}</TableCell>
                                <TableCell>{moment(order.orderTimestamp).format('hh:mm:ss A')}</TableCell>
                                <TableCell>{moment(order.deliveryTimestamp).format('hh:mm:ss A')}</TableCell>
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

export default ReportsDelivery
