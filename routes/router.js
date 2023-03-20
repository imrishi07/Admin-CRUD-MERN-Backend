const express = require("express");
const router = express.Router();
const {
  userPost,
  userGet,
  getSingleUser,
  userEdit,
  userDelete,
  updateUserStatus,
  userExport,
} = require("../controllers/userController");
const upload = require("../multerconfig/storageConfig");

//routes
router.post("/user/register", upload.single("user_profile"), userPost);
router.get("/user/details", userGet);
router.get("/user/:id", getSingleUser);
router.put("/user/edit/:id", upload.single("user_profile"), userEdit);
router.delete("/user/delete/:id", userDelete);
router.put("/user/status/:id", updateUserStatus);
router.get("/userexport", userExport);

module.exports = router;
