export default function deepCopy(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
  
    // Handle Arrays
    if (Array.isArray(obj)) {
      const arrCopy = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = deepCopy(obj[i]); // Recursively copy each element
      }
      return arrCopy;
    }
  
    // Handle Objects
    const objCopy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = deepCopy(obj[key]); // Recursively copy each property
      }
    }
    return objCopy;
  }
  