
const editValidaion = (data) => {
    const allowedUpdates = [
        "firstName",
        "lastName",
        "skills",
        "age",
    ]

    const isUpdateAllowed = Object.keys(data).every((key) => allowedUpdates.includes(key));
    return isUpdateAllowed;
}


module.exports = {editValidaion};