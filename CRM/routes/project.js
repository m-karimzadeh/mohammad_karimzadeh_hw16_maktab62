const express = require('express');
const router = express.Router();

const projectController = require('../controller/project')

router.get('/', function (req, res) {
    return res.send('project route');
})

router.get('/info',
    projectController.selectRecord,
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
    projectController.createRecord,
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
    projectController.updateRecord,
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
    projectController.deleteRecord,
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