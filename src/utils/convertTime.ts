import moment from "moment";

const secondsToFullTimeString = (durationInSeconds: number): string => {
  const timeConversion = moment.duration(durationInSeconds, "seconds");
  const hours = timeConversion.hours();
  const minutes = timeConversion.minutes();
  const seconds = timeConversion.seconds();
  return `${hours <= 10 ? "0" + hours : hours}:${minutes <= 10 ? "0" + minutes : minutes}:${seconds <= 10 ? "0" + seconds : seconds}`;
};

export { secondsToFullTimeString };
