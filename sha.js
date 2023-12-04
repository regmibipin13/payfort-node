function sha2String(arrData) {
    const sortedKeys = Object.keys(arrData).sort();
    const sortedData = {};
    sortedKeys.forEach(key => {
        sortedData[key] = arrData[key];
    });

    // Create a SHA string
    let shaString = '';
    for (const key in sortedData) {
        if (sortedData.hasOwnProperty(key)) {
            shaString += `${key}=${sortedData[key]}`;
        }
    }

    return shaString;
}

module.exports = sha2String;