
const connection = require('../db/mysql');
const commonFu = require('../module/common');


function selectRecord(req, res, next) {
    // localhost:3000/manager/info?id=1

    if (+req.query.id > 0) {
        const sql = `
                    SELECT
                            *
                    FROM
                            manager
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
                if(results[0]){
                    res.locals.recordId = req.query.id;
                    res.locals.resultMsg = results[0];
                    next();

                }else{
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
    //     "phone": "09128102247"
    // }

    if (req.body.name && req.body.family && req.body.phone) {
        connection.query(
            'INSERT INTO manager SET ?',
            {
                name: req.body.name,
                family: req.body.family,
                phone: req.body.phone,
                created_at: commonFu.getTodayDate(),
            },
            function (error, results, fields) {
                if (error) {
                    res.locals.errMsg = "Error recording information";
                    next();

                } else {
                    res.locals.recordId = results.insertId;
                    res.locals.resultMsg = `The information was recorded correctly`;
                    next();
                }

            }
        );
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
    //     "phone": "09128102247"
    // }

    if (+req.body.id > 0 && req.body.name && req.body.family && req.body.phone) {
        const sql = `
                    SELECT
                            id
                    FROM
                            manager
                    WHERE
                            id = ${+req.body.id}
                    LIMIT
                            1
                    `;
                    
        connection.query(sql, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.locals.errMsg = "Error recording information";
                next();

            } else {
                if(results[0]){
                    const sql = `
                                UPDATE
                                        manager
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
                            res.locals.errMsg = "Error recording information";
                            next();
            
                        } else {
                            res.locals.recordId = req.body.id;
                            res.locals.resultMsg = `The information was edited correctly`;
                            next();
                        }
            
                    });

                }else{
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

function deleteRecord(req, res, next) {
    // localhost:3000/manager/delete?id=1

    if (+req.query.id > 0) {
        const sql = `
                    SELECT
                            id
                    FROM
                            manager
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
                if(results[0]){
                    const sql = `
                                DELETE
                                FROM
                                        manager
                                WHERE
                                        id = ${+req.query.id}
                                LIMIT
                                        1
                                `;
                                
                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            res.locals.errMsg = "Error delete";
                            next();
            
                        } else {
                            res.locals.recordId = req.body.id;
                            res.locals.resultMsg = `The information was deleted correctly`;
                            next();
                        }
            
                    });

                }else{
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


module.exports = {
    selectRecord,
    createRecord,
    updateRecord,
    deleteRecord
}