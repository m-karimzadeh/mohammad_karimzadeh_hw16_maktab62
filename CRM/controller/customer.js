
const connection = require('../db/mysql');
const commonFu = require('../module/common');


function selectRecord(req, res, next) {
    // localhost:3000/customer/info?id=1

    if (+req.query.id > 0) {
        const sql = `
                    SELECT
                            *
                    FROM
                            customer
                    WHERE
                            id = ${+req.query.id}
                    LIMIT
                            1
                    `;

        connection.query(sql, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.locals.errMsg = "Error recording information";
                next();

            } else {
                if (results[0]) {
                    res.locals.recordId = req.query.id;
                    res.locals.resultMsg = results[0];
                    next();

                } else {
                    res.locals.errMsg = "The information is not complete";
                    next();
                }
            }

        });

    } else {
        res.locals.errMsg = "The information is not complete";
        next();
    }

}

function createRecord(req, res, next) {
    // {
    //     "name": "mohammad",
    //     "family": "karimzadeh",
    //     "email": "info@test.com",
    //     "phone": "09128102247"
    // }

    if (req.body.name && req.body.family && req.body.email && req.body.phone) {
        (function () {
            return new Promise(function (resolve, reject) {
                connection.query(
                    'INSERT INTO customer SET ?',
                    {
                        name: req.body.name,
                        family: req.body.family,
                        email: req.body.email,
                        phone: req.body.phone,
                        created_at: commonFu.getTodayDate(),
                    },
                    function (error, results, fields) {
                        if (error) {
                            console.log(err);
                            reject("Error recording information")

                        } else {
                            resolve(results.insertId)
                        }

                    }
                );
            });

        })()
            .then((result) => {
                res.locals.recordId = result;
                res.locals.resultMsg = `The information was recorded correctly`;
                next();
            })
            .catch((err) => {
                res.locals.errMsg = err;
                next();
            });


    } else {
        res.locals.errMsg = "The information is not complete";
        next();
    }

}

function updateRecord(req, res, next) {
    // {
    //     "id": 1,
    //     "name": "mohammad",
    //     "family": "karimzadeh",
    //     "email": "test@example.com",
    //     "phone": "09128102247"
    // }

    if (+req.body.id > 0 && req.body.name && req.body.family && req.body.email && req.body.phone) {
        (function () {
            return new Promise(function (resolve, reject) {
                const sql = `
                            SELECT
                                    id
                            FROM
                                    customer
                            WHERE
                                    id = ${+req.body.id}
                            LIMIT
                                    1
                            `;

                connection.query(sql, function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        reject("Error recording information")

                    } else {
                        if (results[0]) {
                            resolve();

                        } else {
                            reject("The information is not complete");
                        }
                    }

                });
            })

        })()
            .then(() => {
                return new Promise(function (resolve, reject) {
                    const sql = `
                                UPDATE
                                        customer
                                SET
                                        name= '${req.body.name}',
                                        family= '${req.body.family}',
                                        phone= '${req.body.phone}'
                                WHERE
                                        id = ${+req.body.id}
                                LIMIT
                                        1
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            reject("Error recording information")

                        } else {
                            resolve(req.body.id);
                        }

                    });
                })
            })
            .then((result) => {
                res.locals.recordId = result;
                res.locals.resultMsg = `The information was recorded correctly`;
                next();
            })
            .catch((err) => {
                res.locals.errMsg = err;
                next();
            });

    } else {
        res.locals.errMsg = "The information is not complete";
        next();
    }

}

function deleteRecord(req, res, next) {
    // localhost:3000/customer/delete?id=1

    if (+req.query.id > 0) {
        (function () {
            return new Promise(function (resolve, reject) {
                const sql = `
                            SELECT
                                    id
                            FROM
                                    customer
                            WHERE
                                    id = ${+req.query.id}
                            LIMIT
                                    1
                            `;

                connection.query(sql, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        reject("Error recording information");

                    } else {
                        if (results[0]) {
                            resolve();

                        } else {
                            reject("The information is not complete");
                        }
                    }

                });
            })

        })()
            .then(() => {
                return new Promise(function (resolve, reject){
                    const sql = `
                                DELETE
                                FROM
                                        customer
                                WHERE
                                        id = ${+req.query.id}
                                LIMIT
                                        1
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            reject("Error delete");

                        } else {
                            resolve()
                        }

                    });
                })
            })
            .then((result) => {
                res.locals.resultMsg = `The information was deleted correctly`;
                next();
            })
            .catch((err) => {
                res.locals.errMsg = err;
                next();
            });

    } else {
        res.locals.errMsg = "The information is not complete";
        next();
    }

}


module.exports = {
    selectRecord,
    createRecord,
    updateRecord,
    deleteRecord
}