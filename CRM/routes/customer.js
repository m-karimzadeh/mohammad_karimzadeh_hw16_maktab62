const express = require('express');
const router = express.Router();

const customerController = require('../controller/customer')

router.get('/', function (req, res) {
    return res.send('customer route');
})

router.get('/info',
    customerController.selectRecord,
    function (req, res) {
        if (res.locals.errMsg) {
            return res.send(
                {
                    status: 400,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.errMsg ?? "error"
                }
            );

        } else {
            return res.send(
                {
                    status: 200,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.resultMsg ?? "ok"
                }
            );
        }
    }
)

router.post('/create',
    customerController.createRecord,
    function (req, res) {
        if (res.locals.errMsg) {
            return res.send(
                {
                    status: 400,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.errMsg ?? "error"
                }
            );

        } else {
            return res.send(
                {
                    status: 200,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.resultMsg ?? "ok"
                }
            );
        }
    }
)

router.post('/update',
    customerController.updateRecord,
    function (req, res) {
        if (res.locals.errMsg) {
            return res.send(
                {
                    status: 400,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.errMsg ?? "error"
                }
            );

        } else {
            return res.send(
                {
                    status: 200,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.resultMsg ?? "ok"
                }
            );
        }
    }
)

router.get('/delete',
    customerController.deleteRecord,
    function (req, res) {
        if (res.locals.errMsg) {
            return res.send(
                {
                    status: 400,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.errMsg ?? "error"
                }
            );

        } else {
            return res.send(
                {
                    status: 200,
                    recordId: res.locals.recordId ?? null,
                    body: res.locals.resultMsg ?? "ok"
                }
            );
        }
    }
)


module.exports = router;