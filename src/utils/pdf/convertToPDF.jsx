import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import convertSecondsToHHMMSS from "../TotalWorkingTime";
import config from "../../config";

const convertToPDF = async (startDate, endDate, setLoader, monthlyTimeSpent) => {
  const element = document.querySelector(".table");

  // Save original styles
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflow;

  // Set styles for full capture
  element.style.height = "auto";
  element.style.overflow = "visible";

  // Wait for any asynchronous content to load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create a new jsPDF instance
  const pdf = new jsPDF("p", "pt", "a4");

  // Function to extract table data
  const extractTableData = (tableElement) => {
    const headers = Array.from(tableElement.querySelectorAll("th")).map((th) =>
      th.textContent.trim()
    );
    const rows = Array.from(tableElement.querySelectorAll("tbody tr")).map(
      (tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.textContent.trim())
    );
    return { headers, rows };
  };

  // Function to create monthly time spent table data
  const createMonthlyTimeSpentTable = (monthlyTimeSpent) => {
    const headers = ["Username", "Target Time", "Time Spent"];
    const rows = monthlyTimeSpent.map(item => [
      item.username,
      "160",  // Adding target time for each row
      convertSecondsToHHMMSS(item.totalWorkedTime / 1000)
    ]);

    // Calculate total time
    const totalTime = monthlyTimeSpent.reduce((acc, curr) => acc + curr.totalWorkedTime, 0);

    // Add total row with target time
    const totalTargetTime = 160 * monthlyTimeSpent.length; // Calculate total target time
    rows.push(["Total", totalTargetTime.toString(), convertSecondsToHHMMSS(totalTime / 1000)]);

    return { headers, rows };
  };

  // Function to add table to PDF
  const addTableToPDF = (pdf, tableData, startY, title) => {
    // Add title in a box
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, startY, pdf.internal.pageSize.getWidth() - 40, 30, "F");
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(title, 30, startY + 20);

    // Add table
    pdf.autoTable({
      head: [tableData.headers],
      body: tableData.rows,
      startY: startY + 40,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 6,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 40,
        fontSize: 9,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
      },
      didDrawPage: (data) => {
        // Add page number
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `Page ${data.pageNumber}`,
          data.settings.margin.left,
          pdf.internal.pageSize.height - 10
        );
      },
    });
    return pdf.lastAutoTable.finalY;
  };

  // Function to capture Recharts graph and add to PDF
  const addGraphToPDF = async (pdf, startY) => {
    const chartElement = document.querySelector(".recharts-wrapper");
    if (!chartElement) {
      console.error("Chart element not found");
      return startY;
    }

    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL("image/png");

    const aspectRatio = canvas.width / canvas.height;
    const maxWidth = pdf.internal.pageSize.getWidth() - 40;
    const maxHeight = 400;

    let imgWidth = maxWidth;
    let imgHeight = imgWidth / aspectRatio;

    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = imgHeight * aspectRatio;
    }

    pdf.addImage(imgData, "PNG", 20, startY, imgWidth, imgHeight);
    return startY + imgHeight;
  };

  // Add summary information
  pdf.setFontSize(24);
  pdf.setTextColor(0);
  pdf.text("Summary Report", 20, 40);

  pdf.setFontSize(12);
  pdf.text(`${startDate} - ${endDate}`, 20, 70);

  // Add logo
  pdf.addImage(
    "https://pmtool.sbinfowaves.com/public/logo.png",
    "JPEG",
    pdf.internal.pageSize.getWidth() - 170,
    20
  );

  // Add Monthly Time Spent Table
  let currentY = 100;
  if (monthlyTimeSpent && monthlyTimeSpent.length > 0) {
    const monthlyTimeTable = createMonthlyTimeSpentTable(monthlyTimeSpent);
    currentY = addTableToPDF(pdf, monthlyTimeTable, currentY, "Monthly Time Summary") + 30;
  }

  // Extract all existing tables
  const tables = element.querySelectorAll(".table-responsive");

  // Process each table
  tables.forEach((table, index) => {
    if (currentY > pdf.internal.pageSize.height - 100) {
      pdf.addPage();
      currentY = 20;
    }
    const tableData = extractTableData(table);

    const dateElement = table
      .closest(".accordion-item")
      .querySelector(".accordion-button");
    const title = dateElement
      ? dateElement.textContent.split("span")[0].trim()
      : `Table ${index + 1}`;

    currentY = addTableToPDF(pdf, tableData, currentY, title) + 30;
  });

  // Add page numbers
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pdf.internal.pageSize.getWidth() - 80,
      pdf.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  pdf.save(`Summary Report(${startDate}- ${endDate})`);
  setLoader(false);

  // Restore original styles
  element.style.height = originalHeight;
  element.style.overflow = originalOverflow;
};

export default convertToPDF;