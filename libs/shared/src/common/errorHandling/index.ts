import { HttpException, HttpStatus } from "@nestjs/common";
import {
  contractPutValidations,
  contractReqValidations,
  contractValidations,
  exProOpValidations,
  gameValidations,
  isString,
  isValidUserRole,
  isValidUserType,
  providerValidations,
  usProOpPutValidations,
  usProOpReqValidations,
  usProOpValidations,
  userPutValidations,
  userReqValidations,
  userValidations,
} from "./validateDataType";

export function checkEmail(email: string): Boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(email);
  return valid ? true : false;
}

export function errRespo(s: number, e?: string, m?: string) {
  return {
    statusCode: s,
    message: m,
    error: e,
  };
}

function extractName(errorMessage) {
  const regex = /FOREIGN KEY \(`([a-zA-Z0-9_]+)`\)/;
  const match = errorMessage.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

export function handleErrors(error: any, type?: string) {
  console.log("handleError :====", error);
  if (error?.code === "ER_DUP_ENTRY") {
    const duplicateKey = error?.sqlMessage.split("'")[1];
    if (type == "contract") {
      throw new HttpException(
        errRespo(
          HttpStatus.CONFLICT,
          error?.sqlMessage,
          `The Contracts between ${duplicateKey} already exists.`
        ),
        HttpStatus.CONFLICT
      );
    }
    throw new HttpException(
      errRespo(
        HttpStatus.CONFLICT,
        error?.sqlMessage,
        `Error: The ${duplicateKey} already exists.`
      ),
      HttpStatus.CONFLICT
    );
  } else if (error?.code === "ER_NO_DEFAULT_FOR_FIELD") {
    throw new HttpException(
      errRespo(HttpStatus.BAD_REQUEST, error?.sqlMessage, "field are empty"),
      HttpStatus.BAD_REQUEST
    );
  } else if (
    error?.code === "ER_NO_REFERENCED_ROW_2" ||
    error?.code === "ER_ROW_IS_REFERENCED_2"
  ) {
    const Name = extractName(error?.sqlMessage);

    throw new HttpException(
      errRespo(
        HttpStatus.BAD_REQUEST,
        error?.sqlMessage,
        `Action not done because the ${
          Name || ""
        } feilds are connected with another table, please change value of column`
      ),
      HttpStatus.BAD_REQUEST
    );
  } else if (
    error.code == "WARN_DATA_TRUNCATED" ||
    error?.code === "ER_TRUNCATED_WRONG_VALUE" ||
    error?.code === "ER_BAD_NULL_ERROR"
  ) {
    throw new HttpException(
      errRespo(
        HttpStatus.BAD_REQUEST,
        error?.sqlMessage,
        "field formate are not valid!"
      ),
      HttpStatus.BAD_REQUEST
    );
    // const match = error?.sqlMessage.match(/'([^']+)'/);
    // throw new HttpException(
    //   `please check ${match[1]} feild its not valid !`,
    //   HttpStatus.BAD_REQUEST
    // );
  } else if (error?.status == 400) {
    throw new HttpException(
      errRespo(HttpStatus.BAD_REQUEST, error?.response),
      HttpStatus.BAD_REQUEST
    );
  } else if (error?.status == 404) {
    throw new HttpException(
      errRespo(HttpStatus.NOT_FOUND, error?.response, "Data Not Found"),
      HttpStatus.NOT_FOUND
    );
  } else if (error?.status == 409) {
    throw new HttpException(
      errRespo(
        HttpStatus.CONFLICT,
        error?.response,
        "feilds are exits already"
      ),
      HttpStatus.CONFLICT
    );
  } else if (error?.code == 403) {
    throw new HttpException(
      errRespo(
        HttpStatus.BAD_REQUEST,
        error?.response?.body?.errors,
        "sendgrid issue try again!"
      ),
      HttpStatus.BAD_REQUEST
    );
  } else {
    const leError = error?.response || error?.sqlMessage;
    throw new HttpException(
      errRespo(HttpStatus.BAD_REQUEST, leError, "bad request"),
      HttpStatus.BAD_REQUEST
    );
  }
}

export function handleError(error) {
  console.log("handleError :====", error);
  if (error?.code === "ER_DUP_ENTRY") {
    const duplicateKey = error?.sqlMessage.split("'")[1];
    const errorMessage = `Error: The ${duplicateKey} already exists.`;
    throw new HttpException(errorMessage, HttpStatus.CONFLICT);
  } else if (error?.code === "ER_NO_DEFAULT_FOR_FIELD") {
    throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, {
      cause: new Error("field are empty"),
    });
  } else if (error?.code === "ER_NO_REFERENCED_ROW_2") {
    throw new HttpException(error?.sqlMessage, HttpStatus.BAD_REQUEST);
  } else if (
    error.code == "WARN_DATA_TRUNCATED" ||
    error?.code === "ER_TRUNCATED_WRONG_VALUE" ||
    error?.code === "ER_BAD_NULL_ERROR"
  ) {
    throw new HttpException(error?.sqlMessage, HttpStatus.BAD_REQUEST);
    // const match = error?.sqlMessage.match(/'([^']+)'/);
    // throw new HttpException(
    //   `please check ${match[1]} feild its not valid !`,
    //   HttpStatus.BAD_REQUEST
    // );
  } else if (error?.status == 400) {
    throw new HttpException(error?.response, HttpStatus.BAD_REQUEST);
  } else if (error?.status == 409) {
    throw new HttpException(error?.response, HttpStatus.CONFLICT);
  } else if (error.code === "ER_DATA_TOO_LONG") {
    const regex = /'([^']*)'/g;
    const matches = error.message?.match(regex);
    throw new HttpException(
      `data is to long for column ${matches}`,
      HttpStatus.BAD_REQUEST
    );
  } else {
    throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
  }
}

export function handleStatusError(error) {
  console.log(error, "handleStatusError");
  if (error?.status == 400) {
    return { status: "error", error: error?.response };
  } else if (error?.code === "ER_DUP_ENTRY") {
    const duplicateKey = error.sqlMessage.split("'")[1];
    const errorMessage = `Error: The ${duplicateKey} already exists.`;
    return { status: "error", error: errorMessage };
  } else if (error.code == "ER_DATA_TOO_LONG") {
    const regex = /'([^']*)'/g;
    const matches = error.message?.match(regex);
    return { status: "error", error: `Data is too long for column ${matches}` };
  } else if (
    error?.code === "WARN_DATA_TRUNCATED" ||
    error?.code === "ER_TRUNCATED_WRONG_VALUE" ||
    error?.code === "ER_BAD_NULL_ERROR"
  ) {
    return { status: "error", error: error.sqlMessage };
  } else if (
    error?.code === "ER_ROW_IS_REFERENCED_2" ||
    "ER_NO_REFERENCED_ROW_2"
  ) {
    // const startIdx = error.sqlMessage.indexOf("REFERENCES `") + 12;
    // const endIdx = error.sqlMessage.indexOf("`", startIdx);
    // const tableName2 = error.sqlMessage.slice(startIdx, endIdx);
    //return { status: "error", error: `${tableName2} feild in not valid! value` };
    return { status: "error", error: error };
  } else if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
    return { status: "error", error: error.message };
  } else {
    return { status: "error", error: error };
  }
}

const resTypeCheck = (m: string) => {
  throw new HttpException(
    errRespo(HttpStatus.BAD_REQUEST, m),
    HttpStatus.BAD_REQUEST
  );
};


/// check all request data is proper
export function checkDtoType(data: any, type: string, method?: string) {
  console.log("checkDtoType Data :====", type, method);
  let res = "no";
  if (method === "put" && !data.id) {
    resTypeCheck("Please provide an ID, it is a required field.");
  }
  if (type === "users") {
    const validation =
    method == "put" ? userPutValidations : userValidations;
    if(method!=="put"){
      validateRequired(data, userReqValidations);
    }
    validateExtraKeys(data, validation);
    validateFormate(data,validation);
  } else if (type === "contracts") {
    const validation =
      method == "put" ? contractPutValidations : contractValidations;
      if(method!=="put"){
        validateRequired(data, contractReqValidations);
      }
      validateExtraKeys(data, validation);
      validateFormate(data,validation);
  } else if (type === "games") {
    const validation = method == "put" ? gameValidations : gameValidations;
    if(method!=="put"){
      validateRequired(data, usProOpReqValidations);
    }
    validateExtraKeys(data, validation);
    validateFormate(data,validation);
  } else if (type === "provider") {
    const validation =
      method == "put" ? providerValidations : providerValidations;
      if(method!=="put"){
        validateRequired(data, usProOpReqValidations);
      }
      validateExtraKeys(data, validation);
      validateFormate(data,validation);
  } else if (type === "externalOP") {
    const validation =
      method == "put" ? exProOpValidations : exProOpValidations;
      if(method!=="put"){
        validateRequired(data, usProOpReqValidations);
      }
      validateExtraKeys(data, validation);
      validateFormate(data,validation);
  } //checked
  else if (type === "UProOp") {
    const validation =
      method == "put" ? usProOpPutValidations : usProOpValidations;
      if(method!=="put"){
        validateRequired(data, usProOpReqValidations);
      }
      validateExtraKeys(data, validation);
      validateFormate(data,validation);
  }

  if (res !== "no") {
    resTypeCheck(res);
  }
}

function validateFormate(obj, validations) {
  const errors = [];
  for (const key in validations) {
    if (obj.hasOwnProperty(key)) {
      const validator = validations[key];
      const value = obj[key];
      if (!validator(value) || value=="") {
        errors.push(key);
      }
    }
  }
  if (errors.length > 0) {
    resTypeCheck(`Invalid format for ${errors.join(' , ')}`);
    return false;
  }
  return true;
}

function validateRequired(obj, validations) {
  const missingParams = [];
  for (const key of validations) {
    if (!obj.hasOwnProperty(key)) {
      missingParams.push(key);
    }
  }
  if (missingParams.length > 0) {
    resTypeCheck(`Required parameter(s) missing: ${missingParams.join(", ")}`);
    return false;
  }
  return true;
}

function validateExtraKeys(compare: any, check: any, method?: string) {
  const extraKeys = [];
  for (const key in compare) {
    console.log(key ,!compare.hasOwnProperty(key),"compare.hasOwnProperty(key)")
    if (!check.hasOwnProperty(key)) {
      extraKeys.push(key);
    }
  }
  if (extraKeys.length > 0) {
    method === "put"
      ? resTypeCheck(`${extraKeys.join(", ")} parameter is not editable`)
      : resTypeCheck(
          `${extraKeys.join(", ")} is not an accepted parameter. Please provide a valid parameter to proceed.`
        );
        return false;
      }
      return true;
}
