import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import moment from 'moment';

//GENERATING THE TOPPINGS REPORT
const generatePDF = (toppings, type) => {
    const doc = new jsPDF();
    const tableColumn = ["Topping id", "Topping Name", "No.of times Ordered (S)", "No.of times Ordered (M)", "No.of times Ordered (L)", "Total"];
    const tableRows = [];

    toppings.forEach(topping => {
        const toppingData = [
        topping.toppingId,
        topping.toppingName,
        topping.smallOrders,
        topping.mediumOrders,
        topping.largeOrders,
        topping.totalOrders
        ];
        tableRows.push(toppingData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text("Topping Report", 14, 15);
    if(type == "save") {
        doc.save(`toppingReport_${dateStr}.pdf`);
    } else {
        doc.output('dataurlnewwindow');
    }
};

export default generatePDF;