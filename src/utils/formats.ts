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

export { collapseLongString, formatFirstAndLastName, formatPhoneNumber };
