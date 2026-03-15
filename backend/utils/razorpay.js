const axios = require("axios");

const RAZORPAY_BASE_URL = process.env.RAZORPAY_MOCK_URL || "https://api.razorpay.com/v1";

module.exports = {
  createOrder: async (amount) => {
    try {
      const response = await axios.post(`${RAZORPAY_BASE_URL}/orders`, {
        amount: amount * 100, // amount in paise
        currency: "INR",
      });
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
