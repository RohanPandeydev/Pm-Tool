import React, { useState, useEffect, memo, useMemo } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RoleServices from "../../services/RoleServices";
import { toast } from "react-toastify";
import Select from "react-select";
import { RoleFrom } from "../../helper/ValidationHelper/Validation";
import ButtonLoader from "../../utils/Loader/ButtonLoader";
import ValidateAuthenticationKey from "../../utils/ValidateAuthenticationKey";

const AddRoleIWithPermission = ({
    setToggleModel,
    prefill,
    setRoleEditData,
}) => {
    // //console.log("prefill", prefill);
    const [checkboxesData, setCheckboxesData] = useState([]);
    const [roleCode, setRoleCode] = useState("");

    const dataprefill = useMemo(() => {
        const moduleNames =
            prefill?.rolePermissions?.map((elem) => elem?.moduleName) || [];

        // Convert ['user', 'role'] to { user: [], role: [] }
        const moduleNameObject = moduleNames.reduce((acc, moduleName) => {
            acc[moduleName] = [];
            return acc;
        }, {});
        let moduleName = [];
        let modulePermissions = moduleNameObject;
        if (prefill) {
            prefill?.rolePermissions.forEach((row) => {
                if (row.modulePermissions.length) {
                    moduleName.push(row.moduleName);
                    modulePermissions[row.moduleName] = row.modulePermissions;
                }
            });
        }
        return { moduleName, modulePermissions };
    }, [prefill]);
    const handleSelectRoleCode = (data) => {
        formik.setFieldValue("roleUId", data?.value);
        setRoleCode(data);
    };
    //////console.log("checkboxesData", checkboxesData);

    const formik = useFormik({
        initialValues: {
            roleName: prefill?.roleName,
            roleUId: prefill?.roleUId,
        },
        validationSchema: RoleFrom,
        onSubmit: (values, action) => {
            // //console.log("checkboxesData", checkboxesData);

            const transformedData = checkboxesData
                .map((row) => {
                    let arr = null;
                    if (row.isChecked) {
                        arr = {
                            moduleName: row.label,
                            modulePermissions: row.children
                                .filter((row2) => row2.isChecked)
                                .map((e) => e.label),
                        };
                    }
                    return arr;
                })
                .filter((e) => !!e);

            ////console.log("data>>>", transformedData);
            // //console.log("transformedData", transformedData);
            if (!!prefill) {
                updtemutation.mutate({
                    roleName: values.roleName,
                    roleUId: values.roleUId,
                    rolePermissions: transformedData,
                    id: prefill?._id,
                });
                return;
            }
            mutation.mutate({
                roleName: values.roleName,
                roleUId: values.roleUId,
                rolePermissions: transformedData,
            });
            action.resetForm();
            return;
        },
    });

    const mutation = useMutation(
        (formdata) => {
            return RoleServices.create(formdata);
        },
        {
            onSuccess: (data) => {
                toast.success("Created Successfully", { delay: 10 });
                // queryClient.invalidateQueries("RoleList");
                // queryClient.refetchQueries("RoleList");
                // setCheckboxesData([])
                setRoleCode("")
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    const updtemutation = useMutation(
        (formdata) => {
            return RoleServices.updteRole(formdata);
        },
        {
            onSuccess: (data) => {
                toast.success("Update Successfully", { delay: 10 });
                // queryClient.invalidateQueries("RoleList");
                // queryClient.refetchQueries("RoleList");
                // setToggleModel(false);
                // setRoleEditData(null)
                // setCheckboxesData([])
                setRoleCode("")
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );

    const handleChange = (e) => {
        //////console.log(e.target.checked, e.target.name);
        let data = checkboxesData;
        let newData = data.map((row) => {
            if (row.label === e.target.name) {
                row.isChecked = e.target.checked;
                row.children = row.children.map((row2) => {
                    row2.isChecked = e.target.checked;
                    return row2;
                });
            }
            return row;
        });
        setCheckboxesData(() => newData);
    };

    // const handleChangePermissions = (e, name, cname) => {
    //     let data = checkboxesData;
    //     // //console.log("name",name,cname,data)
    //     let newData = data.map((row) => {
    //         if (row.label === name) {
    //             let allcheck = [];
    //             row.children = row.children.map((row2) => {
    //                 if (row2.label == cname) {
    //                     row2.isChecked = e.target.checked;
    //                 }
    //                 if (cname !== "read" && e.target.checked) {
    //                     row.children[1].isChecked = true;
    //                 }
    //                 if (row2.isChecked) {
    //                     allcheck.push(true);
    //                 }
    //                 return row2;
    //             });
    //             if (allcheck.length > 0) {
    //                 row.isChecked = true;
    //             } else {
    //                 row.isChecked = false;
    //             }
    //         }
    //         return row;
    //     });
    //     setCheckboxesData(() => newData);
    // };

    const handleChangePermissions = (e, name, cname) => {
        let data = checkboxesData;

        let newData = data.map((row) => {
            if (row.label === name) {
                let allcheck = [];
                let isReadUnchecked = cname === "read" && !e.target.checked;

                row.children = row.children.map((row2) => {
                    // If read is unchecked, uncheck all
                    if (isReadUnchecked) {
                        row2.isChecked = false;
                    } else {
                        // Otherwise, update the clicked checkbox
                        if (row2.label === cname) {
                            row2.isChecked = e.target.checked;
                        }
                        // If any other permission is checked, ensure read is checked
                        if (cname !== "read" && e.target.checked) {
                            row.children.find(c => c.label === "read").isChecked = true;
                        }
                    }

                    // Collect all checked statuses
                    if (row2.isChecked) {
                        allcheck.push(true);
                    }
                    return row2;
                });

                // Set the main row's isChecked based on children's statuses
                row.isChecked = allcheck.length > 0;
            }
            return row;
        });

        setCheckboxesData(() => newData);
    };


    const { data, isLoading } = useQuery(
        ["rolecode"],
        () => RoleServices.getRoleCode(),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log(data?.data?.data,"Role Code")

                return;
            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(
                        err?.response?.status,
                        "Your login session has expired. Please log in again."
                    );
                    return;
                }
                //console.log(err?.response);
                toast.error(err?.response?.data?.message || err?.message, {
                    delay: 10,
                });
            },
        }
    );
    const { data: roleList, isLoading: isRoleListLoaded } = useQuery(
        ["rolepermission"],
        () => RoleServices.getPermissionList(),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // //console.log("======>", dataprefill);
                const formattedData = data?.data?.data?.rolePermissions?.map(
                    (elem) => ({
                        id: elem?.rolePermissionName,
                        label: elem?.rolePermissionName,
                        isChecked: !!dataprefill.moduleName.includes(
                            elem?.rolePermissionName
                        ),
                        children: elem?.roleAccess?.map((each) => ({
                            id: `${elem.rolePermissionName}-${each}`,
                            label: each,
                            isChecked:
                                !!dataprefill.modulePermissions?.[
                                    elem.rolePermissionName
                                ]?.includes(each),
                            name: each.toUpperCase(),
                        })),
                    })
                );
                setCheckboxesData(formattedData);
            },
            onError: (err) => {
                if (err?.response?.status === 401) {
                    ValidateAuthenticationKey(
                        err?.response?.status,
                        "Your login session has expired. Please log in again."
                    );
                } else {
                    // console.error(err?.response);
                    toast.error(err?.response?.data?.message || err?.message, {
                        delay: 10,
                    });
                }
            },
        }
    );

    useEffect(() => {
        if (!!prefill) {
            formik.setFieldValue("roleName", prefill?.roleName);
            formik.setFieldValue("roleUId", prefill?.roleUId);
            setRoleCode({ value: prefill?.roleUId, label: prefill?.roleUId });
            // //console.log("==>",prefill)
            return;
        }
    }, [prefill]);

    return (
        <>
            <div className="Role-update-form">
                <h3>{prefill ? "Update" : "Add"} Role</h3>
                <form action className="Role-form" onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <input
                                type="text"
                                value={formik.values?.roleName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                name="roleName"
                                placeholder="Role Name"
                                className="form-control"
                            />
                            {formik.touched.roleName && (
                                <p className="text-danger"> {formik.errors.roleName} </p>
                            )}
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            {!isLoading && (
                                <Select
                                    value={roleCode}
                                    onChange={handleSelectRoleCode}
                                    options={data?.data?.data?.Rolecodes?.map((elem) => {
                                        return {
                                            value: elem?.roleUId,
                                            label: elem?.roleUId || "N/A",
                                        };
                                    })}
                                    placeholder="Select Role Code"
                                    name="role"
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    style={{ width: "100% !important" }}
                                />
                            )}
                            {/* <input
                                type="text"
                                value={formik.values?.roleUId}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                name="roleUId"
                                placeholder="Role Code"
                                className="form-control"
                            /> */}
                            {formik.touched.roleUId && (
                                <p className="text-danger"> {formik.errors.roleUId} </p>
                            )}
                        </div>
                    </div>
                    <div className="Checkbox-container mt-4">
                        {checkboxesData &&
                            checkboxesData.map((item) => (
                                <div className="form-check mb-4" key={item.id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name={item.label}
                                        id={item.id}
                                        onChange={handleChange}
                                        checked={item.isChecked}
                                    />
                                    <label className="form-check-label" htmlFor={item.id}>
                                        {item.label}
                                    </label>
                                    <div className="d-flex align-items-center">
                                        {item.children.map((row) => (
                                            <div className="form-check mt-2 me-4" key={row.id}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name={row.label}
                                                    id={row.id}
                                                    onChange={(e) =>
                                                        handleChangePermissions(e, item.label, row.label)
                                                    }
                                                    checked={row.isChecked}
                                                />
                                                <label className="form-check-label" htmlFor={row.id}>
                                                    {row.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="btn-content">
                        <button
                            type="button"
                            className="btn form-cancel-btn me-3"
                            onClick={() => {
                                setToggleModel(false), setRoleEditData(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn modal-save-btn"
                            disabled={
                                mutation.isLoading ||
                                updtemutation.isLoading ||
                                isRoleListLoaded ||
                                (checkboxesData &&
                                    !checkboxesData.filter((e) => e.isChecked).length)
                            }
                        >
                            {mutation.isLoading || updtemutation.isLoading ? (
                                <ButtonLoader />
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                    {/* <p className="status">last updated: Mar 13, 2024 6:24 PM</p> */}
                </form>
            </div>
        </>
    );
};

export default memo(AddRoleIWithPermission);
