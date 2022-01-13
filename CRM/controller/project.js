
const connection = require('../db/mysql');
const commonFu = require('../module/common');


function selectRecord(req, res, next) {
    // localhost:3000/project/info?id=1

    if (+req.query.id > 0) {
        let resultArray = {};

        (function () {
            return new Promise(function (resolve, reject) {
                const sql = `
                            SELECT
                                    *
                            FROM
                                    project
                            WHERE
                                    id = ${+req.query.id}
                            `;

                connection.query(sql, function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.locals.errMsg = "Error project information";
                        next();

                    } else {
                        if (results.length) {
                            res.locals.recordId = req.query.id;
                            resultArray["project"] = results[0];
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
                                SELECT
                                        manager.*
                                FROM
                                        manager
                                            INNER JOIN manager_project ON (manager.id = manager_project.manager_id)
                                WHERE
                                        manager_project.project_id = ${+req.query.id}
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            res.locals.errMsg = "Error manager information";
                            next();

                        } else {
                            if (results.length) {
                                res.locals.recordId = req.query.id;
                                resultArray["manager"] = results;
                                resolve();
                            } else {
                                reject("The manager information is not complete");
                            }
                        }

                    });
                })
            })
            .then(() => {
                return new Promise(function (resolve, reject) {
                    const sql = `
                                SELECT
                                        customer.*
                                FROM
                                        customer
                                            INNER JOIN customer_project ON (customer.id = customer_project.customer_id)
                                WHERE
                                        customer_project.project_id = ${+req.query.id}
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            res.locals.errMsg = "Error manager information";
                            next();

                        } else {
                            if (results.length) {
                                res.locals.recordId = req.query.id;
                                resultArray["customer"] = results;
                                resolve();
                            } else {
                                reject("The manager information is not complete");
                            }
                        }

                    });
                })
            })
            .then(() => {
                res.locals.resultMsg = resultArray;
                next();
            })
            .catch((err) => {
                res.locals.errMsg = err;
                next();
            })

    } else {
        res.locals.errMsg = "The information is not complete";
        next();
    }

}

function createRecord(req, res, next) {
    // {
    //     "title": "project title",
    //     "description": "project description",
    //     "customerId": [1,2],
    //     "managerId": [1,2,5]
    // }

    if (req.body.title && req.body.description && req.body.customerId.length > 0 && req.body.managerId.length > 0) {
        (function () {
            return new Promise(function (resolve, reject) {
                const sql = `
                            SELECT
                                    id
                            FROM
                                    customer
                            WHERE
                                    id IN (${req.body.customerId})
                            `;

                connection.query(sql, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        reject("Error customer information");

                    } else {
                        if (results.length === req.body.customerId.length) {
                            resolve();

                        } else {
                            reject("The customer information is not complete");
                        }
                    }

                });
            })

        })()
            .then(() => {
                return new Promise(function (resolve, reject) {
                    const sql = `
                                SELECT
                                        id
                                FROM
                                        manager
                                WHERE
                                        id IN (${req.body.managerId})
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            reject("Error manager information");

                        } else {
                            if (results.length === req.body.managerId.length) {
                                resolve();

                            } else {
                                reject("The manager information is not complete");
                            }
                        }

                    });
                })
            })
            .then(() => {
                return new Promise(function (resolve, reject) {
                    connection.query(
                        'INSERT INTO project SET ?',
                        {
                            title: req.body.title,
                            description: req.body.description,
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
            })
            .then((projectId) => {
                let rowDataArray = [];
                for (let thisId of req.body.managerId) {
                    rowDataArray.push([thisId, projectId])
                }

                return new Promise(function (resolve, reject) {
                    connection.query(
                        `INSERT INTO
                                    manager_project
                                    (manager_id, project_id)
                        VALUES ?`,
                        [rowDataArray],
                        function (error, results, fields) {
                            if (error) {
                                console.log(err);
                                reject("Error relation recording information")

                            } else {
                                resolve(projectId)
                            }

                        }
                    );
                });
            })
            .then((projectId) => {
                return new Promise(function (resolve, reject) {
                    let rowDataArray = [];
                    for (let thisId of req.body.customerId) {
                        rowDataArray.push([thisId, projectId])
                    }

                    connection.query(
                        `INSERT INTO
                                    customer_project
                                    (customer_id, project_id)
                        VALUES ?`,
                        [rowDataArray],
                        function (error, results, fields) {
                            if (error) {
                                console.log(err);
                                reject("Error relation recording information")

                            } else {
                                resolve(projectId)
                            }

                        }
                    );
                });
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

function updateRecord(req, res, next) {
    // {
    //     "id": 1,
    //     "title": "title text",
    //     "description": "description text"
    // }

    if (+req.body.id > 0 && req.body.title && req.body.description) {
        (function () {
            return new Promise(function (resolve, reject) {
                const sql = `
                            SELECT
                                    id
                            FROM
                                    project
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
                                        project
                                SET
                                        title= '${req.body.title}',
                                        description= '${req.body.description}'
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
    // localhost:3000/project/delete?id=1

    if (+req.query.id > 0) {
        (function () {
            return new Promise(function (resolve, reject) {
                const sql = `
                            SELECT
                                    id
                            FROM
                                    project
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
                return new Promise(function (resolve, reject) {
                    const sql = `
                                DELETE
                                FROM
                                        customer_project
                                WHERE
                                        project_id = ${+req.query.id}
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            reject("Error delete project customer");

                        } else {
                            resolve()
                        }

                    });
                })
            })
            .then(() => {
                return new Promise(function (resolve, reject) {
                    const sql = `
                                DELETE
                                FROM
                                        manager_project
                                WHERE
                                        project_id = ${+req.query.id}
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            reject("Error delete project manager");

                        } else {
                            resolve()
                        }

                    });
                })
            })
            .then(() => {
                return new Promise(function (resolve, reject) {
                    const sql = `
                                DELETE
                                FROM
                                        project
                                WHERE
                                        id = ${+req.query.id}
                                LIMIT
                                        1
                                `;

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            reject("Error delete project");

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