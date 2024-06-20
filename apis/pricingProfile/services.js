const { adjustmentModes, adjustmentIncrement } = require("../../const");


const validateCreatePriceProfile = (data) => {
    if (!data) return false;

    if (!data.type || !data.adjustmentMode || !data.adjustmentIncrement || !data.name) {
        return false;
    }

    if (!adjustmentModes.includes(data.adjustmentMode) || !adjustmentIncrement.includes(data.adjustmentIncrement)) {
        return false;
    }

    return true;
}

module.exports = {
    validateCreatePriceProfile
}