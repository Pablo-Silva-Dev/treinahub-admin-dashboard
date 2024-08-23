import moment from "moment";

const collapseLongString = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength).concat("...");
  } else {
    return text;
  }
};

const formatFirstAndLastName = (userName: string) => {
  const splittedName = userName.split(" ");
  const firstName = splittedName[0];
  const lastName = splittedName[splittedName.length - 1];
  return firstName + " " + lastName;
};

const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    const formattedPhone = `+55${digits}`;
    return formattedPhone;
  } else {
    throw new Error("Invalid phone number format");
  }
};

const unformatPhoneNumber = (number: string): string => {
  const localNumber = number.slice(3);

  const areaCode = localNumber.slice(0, 2);
  const nineDigit = localNumber.slice(2, 3);
  const firstPart = localNumber.slice(3, 7);
  const secondPart = localNumber.slice(7);

  return `(${areaCode}) ${nineDigit}${firstPart}-${secondPart}`;
};

const formatDate = (date: string) => {
  return moment.utc(date).format("MM/DD/YYYY");
};

export {
  collapseLongString,
  formatDate,
  formatFirstAndLastName,
  formatPhoneNumber,
  unformatPhoneNumber,
};
