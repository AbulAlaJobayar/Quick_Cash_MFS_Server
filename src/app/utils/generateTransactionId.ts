let sequence = 0;

const generateTransactionId = () => {
  const timestamp = Date.now(); // Current timestamp
  sequence = (sequence + 1) % 10000; // Increment sequence and wrap around
  return `QKS-${timestamp}-${sequence.toString().padStart(4, '0')}`; // Example: "QKS-1698765432100-0001"
};
export default generateTransactionId
