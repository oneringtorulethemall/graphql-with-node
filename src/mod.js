const My_1st_Message = "this is a test message.";
const My_2nd_Message = "this is the second test message.";

const showEquation = equation => {
  return `Equation : [ ${equation}]`;
};

const add = (num1, num2) => {
  if (isNaN(num1)) throw exception("Num1 is not a number");
  if (isNaN(num2)) throw exception("Num2 is not a number.");
  return num1 + num2;
};
const multiply = (num1, num2) => {
  if (isNaN(num1)) throw exception("Num1 is not a number");
  if (isNaN(num2)) throw exception("Num2 is not a number.");
  return num1 * num2;
};
const subtract = (num1, num2) => {
  if (isNaN(num1)) throw exception("Num1 is not a number");
  if (isNaN(num2)) throw exception("Num2 is not a number.");
  return num1 - num2;
};
const divide = (num1, num2) => {
  if (isNaN(num1)) throw exception("Num1 is not a number");
  if (isNaN(num2)) throw exception("Num2 is not a number.");
  return num1 / num2;
};

export {
  My_1st_Message,
  My_2nd_Message,
  showEquation,
  add as default,
  subtract,
  multiply,
  divide
};
