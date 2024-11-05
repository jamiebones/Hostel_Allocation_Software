// import config from "../../config"
// const { JusibePublicKey, JusibeAccessToken } = config.config;

// const Jusibe = require("jusibe");

// const jusibe = new Jusibe(JusibePublicKey, JusibeAccessToken);


// const sendMessage = async ( {receipent, message , from}) => {
//     var payload = {
//         to: receipent,
//         from: from,
//         message: message
//       };
//        try {
//         const send = await jusibe.sendSMS(payload);
//         return send.body;
//        } catch (error) {
//            console.log(error.body)
//            throw new Error(error.body);
//        }
      
// }

// const smsStatus = async ( messageId ) => {
//     try {
//         const messageSent = await jusibe.deliveryStatus(messageId);
//         return messageSent.body;
//     } catch (error) {
//         console.log( error.body );
//         throw new Error(error.body)
//     }
    
// }

// const checkCredit = async () => {
//     try {
//        const credit = await jusibe.getCredits()
//         return credit.body;
//     } catch (error) {
//         console.log( error.body );
//         throw new Error(error.body)
//     }
    
// }


// export default { 
//     checkCredit,
//     sendMessage,
//     smsStatus
// }

