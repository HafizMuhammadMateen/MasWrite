import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log("VAPID Public Key:", keys.publicKey);
console.log("VAPID Private Key:", keys.privateKey);
