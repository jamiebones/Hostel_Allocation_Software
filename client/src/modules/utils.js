import moment from "moment";

const ExtractError = (errorObject) => {
  const { graphQLErrors, networkError } = errorObject;
  const errorArray = [];
  if (graphQLErrors) {
    graphQLErrors.map((message) => {
      errorArray.push(message);
    });
  }
  if (networkError) {
    errorArray.push(networkError);
  }

  return errorArray;
};

const RemoveSlash = (word) => {
  if (word) {
    let replaceSpace = word.replace(/\//g, "_");

    return replaceSpace;
  }
};

const ReplaceSlash = (word) => {
  if (word) {
    let replaceWord = word.replace(/_/g, "/");
    return replaceWord;
  }
};

const IncrementSession = () => {
  let arr = [{ value: "0", text: "select session" }];
  let date = new Date();
  let currentYear = date.getFullYear();
  let nextYear = +currentYear + 1;
  let session = `${currentYear}/${nextYear}`;
  let finalObj = {
    value: session,
    text: session,
  };
  arr.push(finalObj);

  //lets get value for five years before
  for (let i = 1; i <= 5; i++) {
    let loopYear = currentYear - i;
    let loopNextYear = nextYear - i;
    let session = `${loopYear}/${loopNextYear}`;
    let obj = {
      value: session,
      text: session,
    };
    arr.push(obj);
  }

  return arr;
};

const Roles = () => {
  return ["super-admin", "hall supervisor", "normal"];
};

const IncrementSessionFiveYears = () => {
  let arr = [{ value: "0", text: "select session" }];
  let date = new Date();
  let currentYear = date.getFullYear();

  let i = 1;
  let previousYear = currentYear;

  let nextYear = +currentYear + 1;
  let session = `${currentYear}/${nextYear}`;
  let obj = {
    value: session,
    text: session,
  };

  arr.push(obj);

  while (i < 5) {
    previousYear = previousYear - 1;
    const prevNextYear = +previousYear + 1;
    let session = `${previousYear}/${prevNextYear}`;
    let obj = {
      value: session,
      text: session,
    };
    arr.push(obj);
    i++;
  }

  return arr;
};

const LoadFlutterWaveLibrary = (callback) => {
  const existingScript = document.getElementById("flutterWavePayment");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    //script.src="https://ravemodal-dev.herokuapp.com/v3.js";
    script.id = "flutterWavePayment";
    //document.body.appendChild(script);
    document.getElementsByTagName("head")[0].appendChild(script);

    script.onload = () => {
      console.log(script);
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const LoadRemitaClientLibrary = (callback) => {
  const existingScript = document.getElementById("RemitaClientPayment");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src =
      "http://www.remitademo.net/payment/v1/remita-pay-inline.bundle.js";
    //script.src="https://ravemodal-dev.herokuapp.com/v3.js";
    script.id = "RemitaClientPayment";
    //document.body.appendChild(script);
    document.getElementsByTagName("head")[0].appendChild(script);

    script.onload = () => {
      console.log(script);
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const Flutter_Pub_Key = "FLWPUBK_TEST-1d21fe1ac05f980c278f25f1eef9d8c6-X";

const CapFirstLetterOfEachWord = (word) => {
  if (!word) return null;
  const wordArray = word.split(" ");
  let capitalizedWord = "";
  for (let i = 0; i < wordArray.length; i++) {
    const currentWord = wordArray[i];
    if (currentWord) {
      capitalizedWord +=
        currentWord[0].toUpperCase() +
        currentWord.substr(1, currentWord.length) +
        " ";
    }
  }
  return capitalizedWord;
};

const FormatDate = (date) => {
  return moment(date).format("MMMM Do YYYY, h:mm:ss a");
};

const ISAuthorizedToView = (currentUser, accessArray = []) => {
  if (!currentUser) {
    return false;
  }
  if (currentUser && currentUser.accessLevel) {
    const index = accessArray.indexOf(currentUser.accessLevel.toLowerCase());
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const _compareHallNameSort = (a, b) => {
  if (a._id.hallName < b._id.hallName) {
    return -1;
  }
  if (a._id.hallName < b._id.hallName) {
    return 1;
  }
  return 0;
};

const SortAndMergeAsObjectBedStats = (stats = []) => {
  //sort the stats
  const statsCopy = [...stats];

  const sortedArray = statsCopy.sort(_compareHallNameSort);
  //merge each hall into an object
  let array = [];
  let group = {};
  let startKey = false;
  
  for (let i = 0; i < sortedArray.length; i++) {
    const {
      _id: { status, hallName },
      count,
    } = sortedArray[i];

    if (group["hall"] === hallName) {
      group[status] = count;
    } else if (startKey) {
      //we dey the end here
      array.push(group);
      group = {};
      group["hall"] = hallName;
      group[status] = count;
      if (i === sortedArray.length - 1) {
        array.push(group);
      }
    } else {
      startKey = true;
      group["hall"] = hallName;
      group[status] = count;
    }
  }

  return array;
};

export {
  SortAndMergeAsObjectBedStats,
  CapFirstLetterOfEachWord,
  ExtractError,
  RemoveSlash,
  ReplaceSlash,
  IncrementSession,
  Roles,
  IncrementSessionFiveYears,
  LoadFlutterWaveLibrary,
  LoadRemitaClientLibrary,
  Flutter_Pub_Key,
  FormatDate,
  ISAuthorizedToView,
};
