import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import moment from 'moment';

const generatePDF = (orders, type) => {
    const doc = new jsPDF();
    const tableColumn = ["Order id", "Amount", "Rider", "Order Date", "Order Time", "Delivery Time"];
    const tableRows = [];

    orders.forEach(order => {
        const orderData = [
        order.id,
        order.amount + '.00',
        order.deliveryRider,
        moment(order.orderTimestamp).format('DD MMM YYYY'),
        moment(order.orderTimestamp).format('hh:mm:ss A'),
        moment(order.deliveryTimestamp).format('hh:mm:ss A')
        ];
        tableRows.push(orderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text("Order Report", 14, 15);
    if(type == "save") {
        doc.save(`deliveryReport_${dateStr}.pdf`);
    } else {
        doc.output('dataurlnewwindow');
    }
};

export default generatePDF;