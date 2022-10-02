const collegeModel = require("../models/collegeModel");
const internModel = require('../models/internModel');
const { isValid, isValidName, isValidRequest, isValidUrl } = require('../validation/validator')


//<-----------------------------create College --------------------->//

const createCollege = async function (req, res) {

    try {
        let data = req.body
        //using desturcturing
        const { name, fullName, logoLink } = data;

        data["name"] = data["name"].toLowerCase()
        
        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Data is required for creating college details" })
        };

        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "author data is required" });
        }
        
        if (!name) {
            return res
                .status(400)
                .send({ status: false, message: "name is mandatory" })
        };

        if (!isValid(name.trim()) || !isValidName(name.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "name is required or its should contain aplhabets" })
        };

        const isNameUnique = await collegeModel.findOne({ name: name })
        if (isNameUnique) {
            return res
                .status(400)
                .send({ status: false, message: "name already exists" })
        };

        if (!fullName) {
            return res
                .status(400)
                .send({ status: false, message: "fullName is mandatory" })
        };

        if (!isValid(fullName.trim()) || !isValidName(fullName.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "fullName is required or its should contain aplhabets" })
        };

        if (!logoLink) {
            return res
                .status(400)
                .send({ status: false, message: "logoLink is mandatory" })
        };

        if (!isValidUrl(logoLink)) {
            return res
                .status(400)
                .send({ status: false, message: "Put the correct logoLink " })
        };

        const newCollege= await collegeModel.create(data);
        
        let College={
            name:newCollege.name,
            fullName: newCollege.fullName,
            logoLink: newCollege.logoLink,
            isDeleted: newCollege.isDeleted
        }

        return res
            .status(201)
            .send({ status: true, message: newCollege.name + " college created successfully", data: College });

    } catch (err) {
        res.status(500).send({ status: false, message: `this is catch err ${err.message}` });

    }
}

//<-----------------------------college Details---------------------------->//

const collegeDetails = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin","*")
    try {
        let data = req.query;
        let collegeName = req.query.collegeName
        
        if (!collegeName) {
            return res
                .status(400)
                .send({ status: false, message: "collegeName is required for getting interns data" })
        };

        let getClg = await collegeModel.findOne({ name: data.collegeName.toLowerCase(), isDeleted: false });

        if (!getClg) {
            return res
                .status(404)
                .send({ status: false, message: "No such college found" })
        };

        let clgId = getClg.id;

        let getInternData = await internModel.find({ collegeId: clgId, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 });

        if (getInternData==0) {
            return res
                .status(400)
                .send({ status: false, message: "No intern applied for this College" })
        };

        let details = {
            name: getClg.name,
            fullName: getClg.fullName,
            logoLink: getClg.logoLink,
            interns: getInternData
        };
           res
            .status(200)
            .send({ status: true, data: details });

    } catch (err) {
           res
            .status(500)
            .send({ status: false, message: `this is catch err ${err.message}` })
    }
}


module.exports = {createCollege, collegeDetails}
