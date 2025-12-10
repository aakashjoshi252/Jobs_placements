const File = require("../models/File");

const uploadFile = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);  // <--- ADD THIS

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const file = await File.create({
      name: req.file.originalname,
      url: req.file.path,
    });

    res.json({
      success: true,
      message: "File uploaded successfully",
      file,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err); // <--- ADD THIS
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllFiles = async (req, res) => {
  const files = await File.find().sort({ _id: -1 });
  res.json(files);
}

module.exports = {
    uploadFile,
    getAllFiles,
};