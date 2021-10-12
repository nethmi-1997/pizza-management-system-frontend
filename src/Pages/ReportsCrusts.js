import React, { useState, useEffect } from 'react'
import CrustService from '../Services/CrustService';
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
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import generatePDF from '../Reports/crustReportGenerator'
import TextField from "@material-ui/core/TextField";
import PrintIcon from '@material-ui/icons/Print';
import GetAppIcon from '@material-ui/icons/GetApp';
import Tooltip from '@material-ui/core/Tooltip';

//Crust Reports
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

function ReportsCrusts() {
    const [crusts, setCrusts] = useState([]);
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromTimestamp, setFromTimestamp] = useState(new Date());
    const [toTimestamp, setToTimestamp] = React.useState(new Date());

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStartDateChange = (date) => {
        // setFromTimestamp(moment(date).utc().format("YYYY-MM-DD HH:mm:ssZ"));
        // setFromTimestamp(moment(date).utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ").trim());
        setFromTimestamp(new Date(date));
      };

      const handleEndDateChange = (date) => {
        setToTimestamp(new Date(date));
      };

    const handleCrustStats = e => {
        e.preventDefault();

        console.log("Before submission\n"+fromTimestamp+ " \n "+ toTimestamp)

        CrustService.getCrustStats(fromTimestamp, toTimestamp).then(
            response => {
                console.log('Got crust stats');
                setCrusts(Object.values(response.data));
            },
            error => {
                console.log('Error occured getting stats');
                console.log(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString())
            }
        );
    }

    const classes = useStyles();

    return (
        <div className="BodyWindow">
            <div className="BodyWindowTop">
                <div className="BodyWindowTopLeftReport">
                    <SearchIcon/>
                        <input 
                            style={{ width: '200px' }}
                            type="text"
                            placeholder="Search by Crust Name"
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
                            value={fromTimestamp}
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
                            value={toTimestamp}
                            onChange={handleEndDateChange}
                            TextFieldComponent={CssTextField}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <button onClick={handleCrustStats}>
                        Get Results
                    </button>
                    <span className="divider"/>
                    <Tooltip title="Download Report">
                    <button 
                        style={{ width:'60px', paddingTop: '7px', paddingBottom: '3px' }}
                        onClick={() => generatePDF(
                        crusts.filter((crust) => {
                            if (searchTerm == ""){
                                return crust
                            } else if (crust.crustName.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return crust
                            }
                        })
                    , "save")}>
                        <GetAppIcon/>
                    </button>
                    </Tooltip>
                    <Tooltip title="Print Report">
                    <button 
                        style={{ width:'60px', paddingTop: '7px', paddingBottom: '3px' }}
                        onClick={() => generatePDF(
                            crusts.filter((crust) => {
                                if (searchTerm == ""){
                                    return crust
                                } else if (crust.crustName.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                    return crust
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
                                    Crust ID
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Crust Name
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'35px' }}>
                                    No.of times Ordered (S)
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'35px' }}>
                                    No.of times Ordered (M)
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    No.of times Ordered (L)
                                </TableCell>
                                <TableCell className={classes.TableHeaderCell} style={{ paddingLeft:'15px' }}>
                                    Total
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {crusts.filter((crust) => {
                            if (searchTerm == ""){
                                return crust
                            } else if (crust.crustName.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return crust
                            }
                        }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((crust, index) => (
                            <TableRow key={index}>
                                <TableCell>{crust.crustId}</TableCell>
                                <TableCell>{crust.crustName}</TableCell>
                                <TableCell style={{ paddingLeft:'110px' }}>{crust.smallOrders}</TableCell>
                                <TableCell style={{ paddingLeft:'110px' }}>{crust.mediumOrders}</TableCell>
                                <TableCell style={{ paddingLeft:'90px' }}>{crust.largeOrders}</TableCell>
                                <TableCell style={{ paddingLeft:'30px' }}>{crust.totalOrders}</TableCell>
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
            {
            snackbarSuccess ? <FlashMessage message={snackbarMessage} type={snackbarType} /> : ""
            }
        </div>
    )
}

export default ReportsCrusts