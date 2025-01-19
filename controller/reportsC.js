const path = require('path');
const express = require('express');
const report = require('../model/reports')


exports.downloadDailyLinkGet = async (req, res) => {
    let date = req.body.date;
    
    try {
        const signUpId = req.signUp.id;
        const results = await report.findAll({
            attributes: ['link', 'date'],

            where: {
                signUpId: signUpId,
                date:date

            }
        })
        res.status(200).json({ success: true, results })
    } catch (err) {

        console.log(err);
        res.status(500).json({ success: false, error: err })

    }
}
exports.downloadMonthlyLinkGet = async (req, res) => {
    let month = req.body.month;
    
    try {
        const signUpId = req.signUp.id;
        const results = await report.findAll({
            attributes: ['link', 'date'],

            where: {
                signUpId: signUpId,
                month:month

            }
        })
        res.status(200).json({ success: true, results })
    } catch (err) {

        console.log(err);
        res.status(500).json({ success: false, error: err })

    }
}