const express = require('express');
const router = express.Router();
const legacy_db = require('../lib/helpers/db.legacy.helper');
const announcements = legacy_db.get('Announcement');

router.get('/', async function (req, res, next) {
    try {
        const result = await announcements.find(req.query);
        res.send(result);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
