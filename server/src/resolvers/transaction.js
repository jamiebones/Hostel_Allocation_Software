import methods from "../methods";

export default {
  Query: {
    studentTransaction: async (parent, { regNumber }, { models }) => {
      const regToLower = regNumber.toLowerCase();
      const studentTransaction = await models.Transaction.find({
        regNumber: regToLower,
        rrr: { $exists: true, $ne: null },
      }).sort([["session", 1]]);
      return studentTransaction;
    },

    getTransactionWithRRR: async (parent, { rrr }, { models }) => {
      const studentTransaction = await models.Transaction.findOne({
        rrr,
        successful: true,
      });
      return studentTransaction;
    },

    successfultransactions: async (
      parent,
      { session, successful },
      { models }
    ) => {
      const transactionsThatSucceded = await models.Transaction.find({
        session,
        successful: successful,
      });
      return transactionsThatSucceded;
    },

    confirmTransactionUsingRRR: async (parent, { orderID, RRR }, {}) => {
      const transactionStatus = await methods.transactionMethod.confirmRemitaTransaction(
        orderID,
        RRR
      );
      return transactionStatus;
    },
  },

  Mutation: {
    simulateRemitaTransaction: async (_, { regNumber }, { models }) => {
      const lowerRegNumber = regNumber.toLowerCase();
      const transactionStatus = await methods.transactionMethod.simulateRemitaTransaction(
        lowerRegNumber
      );
      return transactionStatus;
    },
    initiateHostelFeePayment: async (_, { regNumber }, { models }) => {
      const lowerRegNumber = regNumber.toLowerCase();
      const transactionDetails = await methods.transactionMethod.makeTransaction(
        lowerRegNumber
      );
      return transactionDetails;
    },
    confirmTransaction: async (_, { flutterId, transId }, {}) => {
      const transaction = await methods.transactionMethod.confirmTransaction(
        flutterId,
        transId
      );
      return transaction;
    },
    generateRemitaRRR: async (_, { regNumber }, {}) => {
      const transaction = await methods.transactionMethod.generateRemitaRRR(
        regNumber
      );
      const env = {
        MerchantId: process.env.MerchantId,
        Api_Key: process.env.Api_Key,
        ServiceTypeId: process.env.ServiceTypeId,
        Gateway: process.env.Gateway,
        CheckStatusUrl: process.env.CheckStatusUrl,
        ReturnRemitaUrl: process.env.ReturnRemitaUrl,
        RRRGateWayPaymentUrl: process.env.RRRGateWayPaymentUrl,
      };

      return { ...transaction, env };
    },
  },

  Transaction: {
    student: async (parent, {}, { models }) => {
      const student = await models.StudentBio.findOne({
        regNumber: parent.regNumber,
      });
      return student;
    },
  },
};
