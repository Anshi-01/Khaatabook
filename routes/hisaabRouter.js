const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const hisaabModel = require("../models/hisaabModel");
const { isLoggedIn } = require("../middlewares");
const { createHisaabController, showHisaabController, viewHisaabController, editHisaabController, deleteHisaabController } = require("../controllers/hisaabController");
const userModel = require("../models/userModel");

// Route to create a new hisaab
router.get("/create", isLoggedIn, showHisaabController);
router.post("/create", isLoggedIn, createHisaabController);

// Route to view a hisaab
// Route to view a hisaab



// Route to show the passcode page
router.get("/passcode/:id", isLoggedIn, (req, res) => {
    console.log("Accessing passcode page for ID:", req.params.id);
    res.render("passcode", { hisaabId: req.params.id });
});

// Route to verify the passcode
router.post("/passcode/:id/verify", isLoggedIn, async (req, res) => {
    const { passcode } = req.body;
    const hisaabId = req.params.id;

    const hisaab = await hisaabModel.findById(hisaabId);
    if (!hisaab) {
        return res.status(404).send("Hisaab not found");
    }

    // Compare the provided passcode with the stored passcode
    if (hisaab.passcode && hisaab.passcode.trim() === passcode.trim()) {
        // Store verified hisaab IDs in session
        if (!req.session.verifiedHisaabs) {
            req.session.verifiedHisaabs = [];
        }
        req.session.verifiedHisaabs.push(hisaabId);

        return res.redirect(`/hisaab/view/${hisaab._id}`);
    }

    req.flash("error", "Incorrect passcode");
    res.redirect(`/hisaab/passcode/${hisaab._id}`);
});


// Route to edit a hisaab
router.get("/edit/:id", isLoggedIn, editHisaabController);

router.post("/edit/:id", isLoggedIn, async (req, res) => {
    const { title, description, editeable, shareable, encrypted, passcode } = req.body;
    const hisaabId = req.params.id;

    await hisaabModel.findByIdAndUpdate(hisaabId, {
        title,
        data: description,
        editeable,
        shareable,
        encrypted,
        passcode,
    });

    res.redirect(`/hisaab/view/${hisaabId}`);
});

// Route to delete a hisaab
router.get("/delete/:id", isLoggedIn, deleteHisaabController);

router.get("/view/:id", isLoggedIn, async (req, res) => {
    const hisaabId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(hisaabId)) {
        return res.status(400).send("Invalid Hisaab ID");
    }

    const hisaab = await hisaabModel.findById(hisaabId);
    if (!hisaab) {
        return res.status(404).send("Hisaab not found");
    }

    // Check if the hisaab is encrypted and passcode hasn't been verified
    if (hisaab.encrypted && !req.session.verifiedHisaabs?.includes(hisaabId)) {
        return res.redirect(`/hisaab/passcode/${hisaab._id}`);
    }

    res.render("hisaab", { hisaab });
});
// Route to edit a hisaab
router.post("/view/:id", isLoggedIn, async (req, res) => {
    const hisaabId = req.params.id; // Get the ID from the request parameters
    const { title, description, editeable, shareable, encrypted, passcode } = req.body;

    // Update the hisaab with the new data
    await hisaabModel.findByIdAndUpdate(hisaabId, {
        title,
        data: description,
        editeable: editeable === "on", // Convert checkbox values to boolean
        shareable: shareable === "on",
        encrypted: encrypted === "on",
        passcode,
    });

    res.redirect(`/hisaab/view/${hisaabId}`); // Redirect to the hisaab view after updating
});

module.exports = router;