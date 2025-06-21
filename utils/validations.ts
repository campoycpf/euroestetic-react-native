import jwt from "jsonwebtoken";

export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Por favor, introduce un email válido';
    }
    return null;
  };
  
  export const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    return null;
  };
  export const isValidToken = (token: string) => {
    try {
      if (!token || !jwt.verify(token, process.env.PAYLOAD_SECRET as string)) {
        return false
      }
    } catch {
      console.log('Invalid token en catch')
      return false
    }
  }
  export const validateDNI = (dni: string): boolean => {
    const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    if (!dniRegex.test(dni)) return false;
    
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(dni.substring(0, 8), 10);
    const letter = dni.charAt(8).toUpperCase();
    
    return letters.charAt(number % 23) === letter;
  };
  
  export const validateNIE = (nie: string): boolean => {
    const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    if (!nieRegex.test(nie)) return false;
    
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const prefixMap: { [key: string]: string } = { 'X': '0', 'Y': '1', 'Z': '2' };
    const prefix = nie.charAt(0).toUpperCase();
    const number = parseInt(prefixMap[prefix] + nie.substring(1, 8), 10);
    const letter = nie.charAt(8).toUpperCase();
    
    return letters.charAt(number % 23) === letter;
  };
  
  export const validateCIF = (cif: string): boolean => {
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW][0-9]{7}[0-9A-J]$/i;
    if (!cifRegex.test(cif)) return false;
    
    const controlLetters = '0123456789ABCDEFGHIJ';
    
    const orgType = cif.charAt(0).toUpperCase();
    const number = cif.substring(1, 8);
    const control = cif.charAt(8).toUpperCase();
    
    // Calcular dígito de control
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      let digit = parseInt(number.charAt(i), 10);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
      }
      sum += digit;
    }
    
    const controlDigit = (10 - (sum % 10)) % 10;
    
    // Algunos tipos de organización usan letra, otros número
    const useLetterControl = 'KLMNPQRSW'.includes(orgType);
    const expectedControl = useLetterControl ? 
      controlLetters.charAt(controlDigit) : 
      controlDigit.toString();
    
    return control === expectedControl;
  };
  
  export const validateCifDniNie = (value: string): true | string => {
    const cleanValue = value.replace(/[-\s]/g, '').toUpperCase();
    
    if (validateDNI(cleanValue) || validateNIE(cleanValue) || validateCIF(cleanValue)) {
      return true;
    }
    
    return 'Por favor, introduce un CIF, DNI o NIE válido';
  };

  export const validateCP = (value: string): true | string => {
    const cpRegex = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    if (!cpRegex.test(value)) {
      return 'El código postal debe ser un número válido de 5 dígitos';
    }
    return true;
  };