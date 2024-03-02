import CryptoJS from 'crypto-js';

  const secretKey = process.env.SECRET_KEY;
console.log('secretKey', process.env);


// Function to encrypt data
export function encryptData(data) {
  
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedData;
}

// Function to decrypt data
export function decryptData(encryptedData) {

  const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
  return decryptedData;
}
// /////useage in components
// import { encryptData, decryptData } from './encryptionUtils';

// // Usage example
// const encryptedAccessToken = encryptData(response.data.Data.AccessToken);
// localStorage.setItem('AccessToken', encryptedAccessToken);

// // Later, when you need to decrypt the token
// const decryptedAccessToken = decryptData(localStorage.getItem('AccessToken'));
// console.log(decryptedAccessToken);