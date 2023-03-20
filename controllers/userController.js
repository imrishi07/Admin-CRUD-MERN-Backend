const User = require("../models/userModel");
const csv = require("fast-csv");
const fs = require("fs");

exports.userPost = async (req, res) => {
  try {
    const file = req.file.filename;
    const { fname, lname, email, mobile, gender, location, status } = req.body;

    if (
      !fname ||
      !lname ||
      !email ||
      !mobile ||
      !gender ||
      !location ||
      !status
    ) {
      res.status(404).send({ error: "All input is required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(401).send({ error: "User already exist" });
    }
    const user = new User({
      fname,
      lname,
      email,
      mobile,
      gender,
      location,
      status,
      profile: file,
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Register Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while register",
      error,
    });
  }
};

exports.userGet = async (req, res) => {
  try {
    const search = req.query.search || "";
    const gender = req.query.gender || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;

    const query = {
      fname: { $regex: search, $options: "i" },
    };

    if (gender !== "All") {
      query.gender = gender;
    }

    if (status !== "All") {
      query.status = status;
    }

    const skip = (page - 1) * ITEM_PER_PAGE; //(1 - 1) * 4 = 0

    const count = await User.countDocuments(query);

    const user = await User.find(query)
      .sort({
        createdAt: sort == "new" ? -1 : 1,
      })
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE); // 8/4 = 2

    res.status(200).send({
      success: true,
      message: "Get user successfully",
      user,
      Pagination: {
        count,
        pageCount,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting user",
      error,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    res.status(200).send({
      success: true,
      message: "Successfully get single user ",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single user",
      error,
    });
  }
};

exports.userEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fname,
      lname,
      email,
      mobile,
      gender,
      location,
      status,
      user_profile,
    } = req.body;
    const file = req.file ? req.file.filename : user_profile;

    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        profile: file,
      },
      { new: true }
    );
    await updateUser.save();
    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating user",
      error,
    });
  }
};

exports.userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userDelete = await User.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Successfully user deleted",
      userDelete,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user",
      error,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      { _id: id },
      { status: data },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "User status successfully updated",
      userUpdate,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating user status",
      error,
    });
  }
};

exports.userExport = async (req, res) => {
  try {
    const userdata = await User.find();
    const csvStream = csv.format({ headers: true });
    if (!fs.existsSync("public/files/export")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }

      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("public/files/export");
      }
    }

    const writablestream = fs.createWriteStream("public/files/export/user.csv");

    csvStream.pipe(writablestream);
    writablestream.on("finish", function () {
      res.status(200).json({
        download: `http://localhost:8000/files/export/user.csv`,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while export user",
      error,
    });
  }
};
