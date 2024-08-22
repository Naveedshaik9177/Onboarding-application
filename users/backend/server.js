const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const path = require('path');
const cors = require('cors'); // Optional: To handle CORS issues if needed

const app = express();
app.use(cors()); // Optional: Enable CORS if frontend and backend are on different ports

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('academicDocuments'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'data.xlsx');

    // Check if the Excel file exists
    let worksheet;
    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet('Sheet1');
    } else {
      worksheet = workbook.addWorksheet('Sheet1');
      worksheet.columns = [
        { header: 'File Name', key: 'fileName' },
        { header: 'Upload Date', key: 'uploadDate' },
      ];
    }

    // Add the file name and upload date to the Excel sheet
    worksheet.addRow({
      fileName: req.file.filename,
      uploadDate: new Date().toLocaleString(),
    });

    await workbook.xlsx.writeFile(filePath);
    res.status(200).send('File uploaded and recorded in Excel.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the file.');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
