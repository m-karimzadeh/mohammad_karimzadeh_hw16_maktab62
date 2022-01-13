const express = require('express');
const router = express.Router();

const managerController = require('../controller/manager')

router.get('/', function (req, res) {
    return res.send('manager route');
})

router.get('/info',
    managerController.selectRecord,
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
    managerController.createRecord,
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
    managerController.updateRecord,
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
    managerController.deleteRecord,
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