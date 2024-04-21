const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const path = require("path");
const fs = require("fs");

const { userLogin } = require("./userControllers");
const { json } = require("express");

// const saveReports = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     console.log(req.file);
//     if (user.reports === "") {
//       await User.findByIdAndUpdate(req.params.id, {
//         reports: req.file.filename,
//       });
//     } else {
//       const filePath = path.join(
//         __dirname,
//         `../uploads/reports/${user.reports}`
//       );
//       //   fs.unlinkSync(filePath, (err) => {
//       //     //delets previous file
//       //     if (err) throw new Error(err);
//       //   });
//       await User.findByIdAndUpdate(req.params.id, {
//         reports: req.file.filename,
//       });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error);
//   }
// });

// const downloadReport = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const filePath = path.join(__dirname, `../uploads/reports/${user.reports}`);
//     res.download(filePath);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error);
//   }
// });

// module.exports = { saveReports, downloadReport };
const saveReports = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.reports !== "") {
      const filePath = path.join(__dirname, `../uploads/reports/${user.reports}`);
      fs.unlinkSync(filePath, (err) => {
        if (err) {
          throw new Error(`Failed to delete previous report: ${err.message}`);
        }
      });
    }

    await User.findByIdAndUpdate(req.params.id, {
      reports: req.file.filename,
    });

    // Return the updated user object with the reports field
    const updatedUser = await User.findById(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: `Failed to save reports: ${error.message}` });
  }
});

const downloadReport = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.reports === "") {
      return res.status(404).json({ message: "Report not found" });
    }

    const filePath = path.join(__dirname, `../uploads/reports/${user.reports}`);
    res.download(filePath);
  } catch (error) {
    res.status(400).json({ message: `Failed to download report: ${error.message}` });
  }
});

module.exports = { saveReports, downloadReport };
