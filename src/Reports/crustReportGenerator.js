import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import moment from 'moment';

//Crust Report Generator
const generatePDF = (crusts, type) => {
    const doc = new jsPDF();
    const tableColumn = ["Crust id", "Crust Name", "No.of times Ordered (S)", "No.of times Ordered (M)", "No.of times Ordered (L)", "Total"];
    const tableRows = [];

    crusts.forEach(crust => {
        const crustData = [
        crust.crustId,
        crust.crustName,
        crust.smallOrders,
        crust.mediumOrders,
        crust.largeOrders,
        crust.totalOrders
        ];
        tableRows.push(crustData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text("Crust Report", 14, 15);
    if(type == "save") {
        doc.save(`crustReport_${dateStr}.pdf`);
    } else {
        doc.output('dataurlnewwindow');
    }
};

export default generatePDF;