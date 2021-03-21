import methods from "../methods";

export default {
  Query: {
    studentTransaction: async (
      parent,
      { regNumber },
      { fastConn, slowConn }
    ) => {
      const regToLower = regNumber.toLowerCase();
      const studentTransaction = await fastConn.models.Transaction.find({
        regNumber: regToLower,
        rrr: { $exists: true, $ne: null },
      }).sort([["session", 1]]);
      return studentTransaction;
    },

    getTransactionWithRRR: async (parent, { rrr }, { fastConn, slowConn }) => {
      const studentTransaction = await fastConn.models.Transaction.findOne({
        rrr,
        successful: true,
      });
      return studentTransaction;
    },

    successfultransactions: async (
      parent,
      { session, successful },
      { fastConn, slowConn }
    ) => {
      const transactionsThatSucceded = await fastConn.models.Transaction.find({
        session,
        successful: successful,
      });
      return transactionsThatSucceded;
    },

    getSuccessfulTransactionsBySession: async (
      parent,
      { session },
      { fastConn, slowConn }
    ) => {
      const transactions = await fastConn.models.Transaction.find({
        session,
        successful: true,
      })
        .sort({ regNumber: 1 })
        .lean();
      return transactions;
    },

    confirmTransactionUsingRRR: async (
      parent,
      { orderID, RRR },
      { fastConn }
    ) => {
      const transactionStatus = await methods.transactionMethod.confirmRemitaTransaction(
        orderID,
        RRR,
        fastConn
      );
      return transactionStatus;
    },
  },

  Mutation: {
    simulateRemitaTransaction: async (_, { regNumber }, { fastConn }) => {
      const lowerRegNumber = regNumber.toLowerCase();
      const transactionStatus = await methods.transactionMethod.simulateRemitaTransaction(
        lowerRegNumber,
        fastConn
      );
      return transactionStatus;
    },
    initiateHostelFeePayment: async (_, { regNumber }, { fastConn }) => {
      const lowerRegNumber = regNumber.toLowerCase();
      const transactionDetails = await methods.transactionMethod.makeTransaction(
        lowerRegNumber,
        fastConn
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
    generateRemitaRRR: async (_, { regNumber }, { fastConn }) => {
      const transaction = await methods.transactionMethod.generateRemitaRRR(
        regNumber,
        fastConn
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
    student: async (parent, {}, { fastConn }) => {
      const student = await fastConn.models.StudentBio.findOne({
        regNumber: parent.regNumber,
      });
      return student;
    },
  },
};
