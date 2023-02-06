let UsersUpload = function () {
    this.ParseCsv = (filename, userObj) => {
        return new Promise((resolve, reject) => {
            try {
                let usersList = [];
                let reports = {
                    errors: [],
                    message: ''
                }
                let shortid = require('shortid').generate();
                let q = async.queue(function (data, callback) {
                    new UploadUser(data, userObj).then((result) => {
                        result.uniqueId = shortid;
                        callback();
                    }).catch((error) => {
                        let errorData = {
                            id: data['Email ID'],
                            message: error.message ? error.message : ''
                        };
                        if (errorData) {
                            reports.errors.push(errorData);
                        }
                        logger.error("web | router | api | user | uploadCSV(function) | Error processing row", error);
                        callback();
                    });
                }, config.environment.userUploadBatchLimit || 100);

                let header = false;
                let stream = fs.createReadStream(filename);
                csv.fromStream(stream, {
                    headers: ["First Name", "Last Name", "Email ID", "Role", "Mobile", "Site Code", "Organization Name", "Domain Name"],
                    ignoreEmpty: true,
                    trim: true,
                    discardUnmappedColumns: true
                }).on("data", function (data) {
                    if (!header) {
                        let validateCSV = utils.validateCSV(data);
                        if (validateCSV) {
                            header = true;
                            logger.info("web | router | api | user | uploadCSV(function) | Processing header");
                        } else {
                            let errorData = {
                                id: 'Invalid File Upload',
                                message: 'Wrong File Uploaded. Error occured due to columns Mismatch. Please upload the right file.'
                            };
                            if (errorData) {
                                reports.message = 'Users upload failed';
                                reports.errors.push(errorData);
                                reject(reports);
                            }
                        }
                    } else {
                        let userData = usersList.filter(x => x['Email ID'] === data['Email ID']);
                        if (userData.length > 0) {} else {
                            usersList.push(data);
                            q.push(data, function (err) {
                                if (err) {
                                    logger.warn("web | router | api | user | uploadCSV(function) | Error in row", data, err);
                                }
                            });
                        }
                    }
                }).on("end", function () {
                    logger.info("web | router | api | user | uploadCSV(function) | Successfuly parsed csv file");
                    deleteFile(filename);
                    q.drain = function () {
                        logger.info("web | router | api | user | uploadCSV(function) | All items processed");
                        if (reports.errors.length > 0) {
                            reports.message = 'Users upload failed';
                            reject(reports);
                        } else {
                            resolve({
                                message: 'Users uploaded successfully'
                            });
                        }
                    };
                }).on("error", function (error) {
                    deleteFile(filename);
                    logger.warn("web | router | api | user | uploadCSV(function) | Error Parsing CSV file ", error);
                    reject(error);
                });
            } catch (err) {
                deleteFile(filename);
                return reject(err);
            }
        })
    }

    function deleteFile(filename) {
        fs.unlink(filename, (err) => {
            if (err) {
                logger.error("web | router | api | user | deleteFile(function) | Error deleting file", err);
            } else {
                logger.info("web | router | api | user | deleteFile(function) | Removed uploaded file ", filename);
            }
        });
    }

    function UploadUser(data, userObj) {
        let userController = new Users();
        return new Promise(async (resolve, reject) => {
            let user = {
                userid: data["Email ID"].toLowerCase().trim(),
                firstname: data["First Name"].toLowerCase().trim(),
                lastname: data["Last Name"],
                email: data["Email ID"].toLowerCase().trim(),
                role: data["Role"],
                mobile: data["Mobile"],
                site_code: [data["Site Code"]],
            }

            let validEmail = utils.validateEmail(user.userid);
            if (!validEmail) {
                user['error'] = true;
                reject({
                    message: 'Invalid Email ID'
                });
            }

            let validRole = await roleController.isRoleExist(user.role);
            if (!validRole) {
                user['error'] = true;
                reject({
                    message: 'Role Not Exists'
                });
            }
            let _vendor = await vendorController.isVendorExists(data["Organization Name"], data["Domain Name"])
            if (!_vendor) {
                user['error'] = true;
                reject({
                    message: data["Organization Name"] + " " + data["Domain Name"] + ' Vendor not exists'
                });
            } else
                user.vendor = _vendor._id


            if (user && !user.error) {
                userController.getUser(user.userid).then((result) => {
                    if (!result) {
                        if (!user.password) {
                            user.password = config.environment.defaultPassword;
                        }
                        userController.createUser(user, userObj).then(() => {
                            logger.info('web | router | api | user | UploadUser(function) | save user success')
                            user.report_status = "success";
                            resolve(user);
                        }).catch((err) => {
                            logger.error('web | router | api | user | UploadUser(function) | Error: ', err)
                            user.report_status = err.message;
                            reject(err);
                        });
                    } else {
                        logger.info('web | router | api | user | UploadUser(function) | user already exist')
                        userController.updateUser(user, 'upload').then(() => {
                            logger.info('web | router | api | user | UploadUser(function) | save user success')
                            user.report_status = "update success";
                            resolve(user);
                        }).catch((err) => {
                            logger.error('web | router | api | user | UploadUser(function) | Error: ', err.message)
                            user.report_status = err.message;
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    logger.error('web | router | api | user | UploadUser(function) | err', err.message)
                    user.report_status = err.message;
                    reject(err);
                });
            } else {}
        });
    }

}