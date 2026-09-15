export const generateCode = (prefix = 'ORD'): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};
