// users Validation :
export const userValidations = {
  email: isString,
  firstname: isString,
  lastname: isString,
  mobile: isString,
  whatsapp: isString,
  skype: isString,
  slack: isString,
  telegram: isString,
  signal: isString,
  viber: isString,
  discord: isString,
  userRole: isValidUserRole,
  userType: isValidUserType,
};
export const userPutValidations = {
  id:isString,
  firstname: isString,
  lastname: isString,
  mobile: isString,
  whatsapp: isString,
  skype: isString,
  slack: isString,
  telegram: isString,
  signal: isString,
  viber: isString,
  discord: isString,
  userType: isValidUserType,
};
export const userReqValidations = [
  "email",
  "firstname",
  "lastname",
  "mobile",
  "userRole",
  "userType",
];

// Validate contract data types
export const contractValidations = {
  contractName: isString,
  startDate: isString, // Assuming the date should be a string
  duration: isNumber,
  termPeriod: isNumber,
  autoRenewPerTerm: isNumber,
  gracePerMin: isNumber,
  minRevshareGen: isNumber,
  setUpCost: isNumber,
  bonusPromotions: isBoolean,
  allGamesInclude: isBoolean,
  bonusCap: isNumber,
  gameExceptions: isValidStringArray,
  includedCountries: isValidStringArray,
  restrictedCountries: isValidStringArray,
  localLicenses: isValidStringArray,
  revshareRevenueTiers: isBoolean,
  revShareProvider: isNumber,
  revShareProviderTiers: (value) =>
    Array.isArray(value) &&
    value.every(
      (tier) =>
        isNumber(tier.min) && isNumber(tier.max) && isString(tier.revShare)
    ),
  currency: isString,
  revShareBased: isString,
  revShareTiedToGameType: isBoolean,
  gameType: isValidStringArray,
  brandedGameSurchargeIn: isNumber,
  negativeCarryOverAllowed: isBoolean,
  physicalContract: validatePDF,
  operatorId: isString,
  providerId: isString,
  createdBy: (value) => value && typeof value.id === "string",
  index: isValidUserRole,
  refIndex: isValidScrapeType,
};
export const contractPutValidations = {
  id:isString,
  contractName: isString,
  startDate: isString, // Assuming the date should be a string
  duration: isNumber,
  termPeriod: isNumber,
  autoRenewPerTerm: isNumber,
  gracePerMin: isNumber,
  minRevshareGen: isNumber,
  setUpCost: isNumber,
  bonusPromotions: isBoolean,
  allGamesInclude: isBoolean,
  bonusCap: isNumber,
  gameExceptions: isValidStringArray,
  includedCountries: isValidStringArray,
  restrictedCountries: isValidStringArray,
  localLicenses: isValidStringArray,
  revshareRevenueTiers: isBoolean,
  revShareProvider: isNumber,
  revShareProviderTiers: (value) =>
    Array.isArray(value) &&
    value.every(
      (tier) =>
        isNumber(tier.min) && isNumber(tier.max) && isString(tier.revShare)
    ),
  currency: isString,
  revShareBased: isString,
  revShareTiedToGameType: isBoolean,
  gameType: isValidStringArray,
  brandedGameSurchargeIn: isNumber,
  negativeCarryOverAllowed: isBoolean,
  physicalContract: validatePDF,
};
export const contractReqValidations = [
  "contractName","includedCountries","restrictedCountries",
  "operatorId","localLicenses","currency","revShareBased","revShareProviderTiers","revShareTiedToGameType",
  "version","gameType","minRevshareGen","bonusPromotions",
  "startDate","gracePerMin", 
"allGamesInclude",
];

// Games check validation
export const gameValidations = {
  id: isString,
  gameName: isString,
  gameDescShort: isString,
  gameDescLong: isString,
  gameType: isString,
  brandedGame: isBoolean,
  platforms: isValidPlatforms,
  volatility: isValidVolatility,
  technology: isValidTechnology,
  defaultBet: isNumber,
  minimumBet: isNumber,
  maxBetSmallOperators: isNumber,
  maxBetBigOperators: isNumber,
  gameEmail: isString,
  demoLink: isValidURL,
  deepLink: isValidURL,
  backLink: isValidURL,
  launchURLFormat: isValidStringArray,
  transactionDataLink: isValidURL,
  rtp: isNumber,
  rtpsVariation: Array.isArray,
  maxMultiplier: isNumber,
  hitRate: isNumber,
  vsPayWays: isNumber,
  vsHorizontal: isNumber,
  vsVertical: isNumber,
  certifiedCountries: isValidStringArray,
  certifiedCountryCheck:isBoolean,
  multiLiveExpDate:isString,
  certifiedFile:isString,
  goLiveDate: isString,
  expirationDate: isString,
  autoDetectMobile: isBoolean,
  featureBonusRetriggered: isBoolean,
  marketingBonus: isBoolean,
  backToLobbyURL: isBoolean,
  addDepositURL: isBoolean,
  dynamicPromotion: isBoolean,
  responsibleGaming: isBoolean,
  miniGamesSupported: isBoolean,
  currencyCode: isString,
  gameSpecialFeatures: isString,
  numberOfSymbolsTrigger: isNumber,
  numberOfFreeSpinsAwarded: isNumber,
  stackedExpandingWildsInGame: isBoolean,
  numberOfJackpotTiers: isNumber,
  autoPlayFunction: isBoolean,
  logosOfGame: Array.isArray, // Assuming it's an array
  gameTheme: Array.isArray,
  createdBy: (value) => value && isString(value.id),
  providerId: (value) => value && isString(value.id),
  createdDate: isString,
  modifiedDate: isString,
};

export const providerValidations = {
  companyName: isString,
  companyEmail: isString,
  currentQuarterRank: isNumber,
  lastQuarterRank: isNumber,
  website: isString,
  ipRange: isString, // Assuming it should be a string
  vatId: isString,
  taxId: isString,
  registrationNumber: isString,
  address: isString,
  memberId: isString,
  planStatus: isPlanStatus,
  servicePlan: isServicePlan,
  planDetails: isString,
  isAcceptedTerm: isBoolean,
  createdBy: (value) => value && isString(value.id),
  emailSubscription: isBoolean,
};

export const exProOpValidations = {
  companyName: isString,
  companyEmail: isValidEmail,
  currentQuarterRank: isNumber,
  lastQuarterRank: isNumber,
  website: isString,
  oldId: isString,
  ipRange: isString,
  vatId: isString,
  taxId: isString,
  registrationNumber: isString,
  address: isString,
  city: isString,
  logo: isValidURL,
  state: isString,
  zip: isString,
  index: isValidUserRole,
  emailSubscription: isBoolean,
};

/// sub user Dto
export const usProOpPutValidations = {
  id: isString,
  status: isValidSubUserStatus,
};
export const usProOpValidations = {
  userId: isObject,
  companyId: isString,
  status: isValidSubUserStatus,
};
export const usProOpReqValidations = ["userId", "companyId"];

export function isValidTechnology(role) {
  return role === "HTML5" || role === "Flash" || role === "Javascript/WebGL";
}

export function isValidPlatforms(role) {
  return (
    role === "Mobile" ||
    role === "Desktop" ||
    role === "Native App" ||
    role === "Download"
  );
}

export function isValidVolatility(role) {
  return role === "Low" || role === "Medium" || role === "High";
}

// Function to check if a value is a string
export function isString(value) {
  return typeof value === "string";
}

export function isBoolean(value) {
  return typeof value === "boolean";
}

// Function to check if a value is a number
export function isNumber(value) {
  return typeof value === "number";
}

// Function to validate an array of strings
export function isValidStringArray(arr) {
  return Array.isArray(arr) && arr.every(isString);
}

export function isValidUserRole(role) {
  return (
    role === "Provider" ||
    role === "Operator" ||
    role === "Sub Operator" ||
    role === "Sub Provider"
  );
}
export function isValidSubUserStatus(role) {
  return role === "Active" || role === "Deactive";
}

// Function to validate userType
export function isValidUserType(type) {
  return type === "Commercial User" || type === "Technical User";
}

// Function to validate userType
export function isPlanStatus(type) {
  return type === "ACTIVE" || type === "CANCELED";
}

export function isServicePlan(type) {
  return (
    type === "Startup" ||
    type === "Freemium" ||
    type === "PremiumOperator" ||
    type === "PremiumProvider" ||
    type === "GoldOperator" ||
    type === "GoldProvider"
  );
}

// Function to validate userType
export function isValidScrapeType(type) {
  return type === "Internal" || type === "Scraper";
}

export function validatePDF(url) {
  const urlParts = url.split(".");
  const fileExtension = urlParts[urlParts.length - 1].toLowerCase();
  if (fileExtension === "pdf") {
    return true;
  } else {
    return false;
  }
}

// Function to check if a value is a valid email address
export function isValidEmail(value) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(value);
}

// Function to check if a value is a valid URL
export function isValidURL(value) {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
}

function isObject(value) {
  return typeof value === "object" && !Array.isArray(value);
}
