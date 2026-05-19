const ERROR_MESSAGES = require('../constants/errorMessages');

/**
 * Profile Validators
 */
class ProfileValidator {
  /**
   * Validate profile data
   */
  static validateProfileData(data) {
    const errors = [];

    if (data.full_name !== undefined && data.full_name.trim().length < 2) {
      errors.push(ERROR_MESSAGES.NAME_MIN_LENGTH);
    }

    if (data.phone !== undefined && !this.isValidPhone(data.phone)) {
      errors.push(ERROR_MESSAGES.PHONE_INVALID);
    }

    if (data.address !== undefined && data.address.trim() === '') {
      errors.push(ERROR_MESSAGES.ADDRESS_REQUIRED);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate phone format
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate name
   */
  static validateName(name) {
    if (!name || name.trim().length < 2) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.NAME_MIN_LENGTH
      };
    }
    return { isValid: true };
  }

  /**
   * Validate phone
   */
  static validatePhone(phone) {
    if (!this.isValidPhone(phone)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.PHONE_INVALID
      };
    }
    return { isValid: true };
  }

  /**
   * Validate address
   */
  static validateAddress(address) {
    if (!address || address.trim() === '') {
      return {
        isValid: false,
        error: ERROR_MESSAGES.ADDRESS_REQUIRED
      };
    }
    return { isValid: true };
  }
}

module.exports = ProfileValidator;
