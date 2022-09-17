const internModel = require('../models/internModel');
const collegeModel = require('../models/collegeModel');
const { isValid, isValidEmail, isValidMobile, isValidName } = require('../validation/validator');


//<----------------------------------create Intern--------------------------------> //

const createIntern = async (req, res) => {
    try {
        let data = req.body;

        let { name, mobile, email, collegeName } = data;

        data["email"] = data["email"].toLowerCase()

        if (Object.keys(data).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Data is required for creating Intern Details" })
        };

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

        if (!email) {
            return res
                .status(400)
                .send({ status: false, message: "emailId is mandatory" })
        };

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "please enter valid emailId" })
        };

        if (!mobile) {
            return res
                .status(400)
                .send({ status: false, message: "mobile number is mandatory" })
        };

        if (!isValidMobile(mobile)) {
            return res
                .status(400)
                .send({ status: false, message: "please enter valid mobile number" })
        };


        let checkEmail = await internModel.findOne({ email: email, isDeleted: false })
        if (checkEmail) {
            return res
                .status(400)
                .send({ message: "Email Already Registered" })
        };

        let checkMobile = await internModel.findOne({ mobile: mobile, isDeleted: false })
        if (checkMobile) {
            return res
                .status(400)
                .send({ message: "Mobile Already Registered" })
        };

        let checkClgName = await collegeModel.findOne({ name: collegeName.toLowerCase(), isDeleted: false })
        if (!checkClgName) {
            return res
                .status(404)
                .send({ status: false, message: "No such college Name Not Found!" })
        };

        let clgId = checkClgName._id
        req.body.collegeId = clgId

        let internData = await internModel.create(data)
    
        let interndata={
            isDeleted: internData.isDeleted,
            name:internData.name,
            email:internData.email,
            mobile: internData.mobile,
            collegeId: internData.collegeId,
        }

        res.status(201).send({ status: true, data: interndata })

    } catch (err) {
        res.status(500).send({ status: false, message: `this is catch err ${err.message}` })
    }
}


module.exports.createIntern = createIntern;