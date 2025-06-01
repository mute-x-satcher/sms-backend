const pdf = require('html-pdf');

function generateHTML(data) {
  const rows = data.attendance.map(student => `
    <tr>
      <td>${student.rollNumber}</td>
      <td>${student.studentName}</td>
      <td class="${student.status === 'absent' ? 'status-absent' : 'status-present'}">${student.status}</td>
    </tr>`).join('');

  return `
    <html>
      <head>
        <style>
          /* Body and overall layout */
          body {
            font-family: Arial, sans-serif;
            margin: 10px 30px;
            font-size: 12px;
            background-color: #f9fbfd; /* light blue background */
            color: #2e3c43;             /* soft dark text */
          }

          /* Header boxes */
          .info-box {
            border: 1px solid #c5cbd3;
            background-color: #ffffff;
            padding: 6px 10px;
            margin: 6px 0;
            width: fit-content;
          }

          /* Container for table with extra margin */
          .table-container {
            margin-left: 20px;
            margin-right: 20px;
          }

          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 40px;
          }

          th, td {
            border: 1px solid #c5cbd3; /* soft gray border */
            padding: 4px 6px;
            text-align: left;
          }

          th {
            background-color: #d0e3f1; /* light blue header */
          }

          /* Status colors */
          .status-present {
            color: #2e7d32; /* green */
            font-weight: bold;
          }

          .status-absent {
            color: #c62828; /* red */
            font-weight: bold;
          }

          /* Print styling */
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm 18mm;
            }
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="info-box"><strong>Class:</strong> ${data.className}</div>
        <div class="info-box"><strong>Date:</strong> ${data.reportDate}</div>
        <div class="info-box"><strong>Report Name:</strong> ${data.reportName}</div>

        <div class="table-container">
          <table>
            <thead>
              <tr><th>Roll Number</th><th>Student Name</th><th>Status</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </body>
    </html>`;
}

function generatePDFBuffer(data) {
  const html = generateHTML(data);

  return new Promise((resolve, reject) => {
    pdf.create(html, { format: 'A4' }).toBuffer((err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
}

module.exports = generatePDFBuffer;
