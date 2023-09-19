import fetch from "node-fetch";
import fs from "fs";
import { expect } from 'expect';

var server1 = "http://localhost:3001/v1.0";
var server2 = "http://localhost:3001/v1.0";

var headers = new Headers();
headers.append('Authorization', 'Basic ' + Buffer.from("admin@xient.de:xient123").toString('base64'));
headers.append('Content-Type', 'application/json');

var user1 = {
  id: null,
  email: 'a1@a.de',
  firstname: 'firstname1',
  lastname: 'lastname',
  password: 'password1',
  mobile: 'mobile1',
  whatsapp: 'whatsapp1',
  skype: 'skype1',
  slack: 'slack1',
  telegram: 'telegram1',
  signal: 'signal1',
  viber: 'viber1',
  discord: 'discord1',
  address : 'Straße 1',
  city : 'Hernn 1',
  state : 'NRW 1',
  zip : '00001'
};

var user2 = {
  id: null,
  email: 'a2@a.de',
  firstname: 'firstname2',
  lastname: 'lastname2',
  password: 'password2',
  mobile: 'mobile2',
  whatsapp: 'whatsapp2',
  skype: 'skype2',
  slack: 'slack2',
  telegram: 'telegram2',
  signal: 'signal2',
  viber: 'viber2',
  discord: 'discord2',
  address : 'Straße 2',
  city : 'Hernn 2',
  state : 'NRW 2',
  zip : '00002'
};

var operator1 = {
  id: null,
  usednexus: true,
  companyName: 'companyName1',
  ipRange: 'ipRange1',
  vatId: 'vatId1',
  taxId: 'taxId1',
  registrationNumber: 'registrationNumber1',
  address: 'address1',
  city: 'city1',
  state: 'state1',
  zip: 'zip1',
  commercialUser: user1,
  technicalUser: user1
};

var operator2 = {
  id: null,
  usednexus: true,
  companyName: 'companyName2',
  ipRange: 'ipRange2',
  vatId: 'vatId2',
  taxId: 'taxId2',
  registrationNumber: 'registrationNumber2',
  address: 'address2',
  city: 'city2',
  state: 'state2',
  zip: 'zip2',
  commercialUser: user2,
  technicalUser: user2
};

var provider1 = {
  id: null,
  companyName: "companyName1",
  ipRange: "ipRange1",
  vatId: "vatId1",
  taxId: "taxId1",
  registrationNumber: "registrationNumber1",
  address: "address1",
  city: "city1",
  state: "state1",
  zip: "zip1",
  technicalUser: user1,
  commercialUser: user1
};

var provider2 = {
  id: null,
  companyName: "companyName2",
  ipRange: "ipRange2",
  vatId: "vatId2",
  taxId: "taxId2",
  registrationNumber: "registrationNumber2",
  address: "address2",
  city: "city2",
  state: "state2",
  zip: "zip2",
  technicalUser: user2,
  commercialUser: user2
};

var contract1 = {
  id: null,
  contractName: 'contractName1',
  version: 0,
  startDate: new Date(),
  duration:0,
  termPeriod:0,
  autoRenewPerTerm:0,
  allGamesIncl:false,
  gracePerMin:0,
  minRevshareGen:0,
  setupCost : 1,
  bonusPromotions:false,
  bonusCap:0,
  revShareProvider:0,
  gameExceptions: ["de", "en", "fr"],
  includedCountries: ["de", "en", "fr"],
  restrictedCountries: ["de", "en", "fr"],
  localLicenses: ["de", "en", "fr"],
  revshareRevenueTiers: ["de", "en", "fr"],
  currency: "€",
  operator: operator1,
  provider: provider1
};

var contract2 = {
  id: null,
  contractName: 'contractName2',
  version: 0,
  startDate: new Date(),
  duration:0,
  termPeriod:0,
  autoRenewPerTerm:0,
  allGamesIncl:false,
  gracePerMin:0,
  minRevshareGen:0,
  setupCost : 1,
  bonusPromotions:false,
  bonusCap:0,
  revShareProvider:0,
  gameExceptions: ["de", "en", "fr"],
  includedCountries: ["de", "en", "fr"],
  restrictedCountries: ["de", "en", "fr"],
  localLicenses: ["de", "en", "fr"],
  revshareRevenueTiers: ["de", "en", "fr"],
  currency: "€",
  operator: operator2,
  provider: provider2
};

var game1 = {
  id: null,
  gameName: 'gameName1',
  gameDescShort: 'gameDescShort1',
  gameDescLong: 'gameDescLong1',
  gameType: 'gameType1',
  gameTheme: 'gameTheme1',
  gameStatus: 'gameStatus1',
  technology: 'technology1',
  platforms: 'platforms1',
  volatility: 'volatility1',
  defaultBet: 0,
  minimumBet: 0,
  maxBetSmallOperators: 0,
  maxBetBigOperators: 0,
  gameEmail: 'gameEmail1',
  demoLink: 'demoLink1',
  deepLink: 'deepLink1',
  backLink: 'backLink1',
  launchURLFormat: 'launchURLFormat1',
  transactionDataLink: 'transactionDataLink1',
  rtp: 0,
  rtpsVariation: 0,
  maxMultiplier: 0,
  hitRate: 0,
  vsPayWays: 0,
  vsHorizontal: 0,
  vsVertical: 0,
  certifiedCountryCheck:true,
  multiLiveExpDate:[{goLiveDate1:"Wed May 24 2023"},{expirationDate1:"Wed May 25 2023"}],
  certifiedCountries: ["de", "en", "fr"],
  goLiveDate: new Date(),
  expirationDate: new Date(),
  autoDetectMobile: false,
  marketingBonus: false,
  backToLobbyURL: false,
  addDepositURL: false,
  dynamicPromotion: false,
  responsibleGaming: false,
  miniGamesSupported: false,
  currency: "€",
  contract: contract1
};

var game2 = {
  id: null,
  gameName: 'gameName2',
  gameDescShort: 'gameDescShort2',
  gameDescLong: 'gameDescLong2',
  gameType: 'gameType2',
  gameTheme: 'gameTheme2',
  gameStatus: 'gameStatus2',
  technology: 'technology2',
  platforms: 'platforms2',
  volatility: 'volatility2',
  defaultBet: 0,
  minimumBet: 0,
  maxBetSmallOperators: 0,
  maxBetBigOperators: 0,
  gameEmail: 'gameEmail2',
  demoLink: 'demoLink2',
  deepLink: 'deepLink2',
  backLink: 'backLink2',
  launchURLFormat: 'launchURLFormat2',
  transactionDataLink: 'transactionDataLink2',
  rtp: 0,
  rtpsVariation: 0,
  maxMultiplier: 0,
  hitRate: 0,
  vsPayWays: 0,
  vsHorizontal: 0,
  vsVertical: 0,
  certifiedCountryCheck:true,
  multiLiveExpDate:[{goLiveDate1:"Wed May 24 2023"},{expirationDate1:"Wed May 25 2023"}],
  certifiedCountries: ["de", "en", "fr"],
  goLiveDate: new Date(),
  expirationDate: new Date(),
  autoDetectMobile: false,
  marketingBonus: false,
  backToLobbyURL: false,
  addDepositURL: false,
  dynamicPromotion: false,
  responsibleGaming: false,
  miniGamesSupported: false,
  currency: "€",
  contract: contract2
};

async function mainTest(){
  await myUnitTest(startTest, 'startTest');
  
  await myUnitTest(testIndex, 'Test Index');
  await myUnitTest(clearDatabases, 'clearDatabases');
  
  await myUnitTest(createUsers, 'createUsers');
  await myUnitTest(createOperators, 'createOperators');
  await myUnitTest(createProviders, 'createProviders');
  await myUnitTest(createContracts, 'createContracts');
  await myUnitTest(createGames, 'createGames');
  
  await myUnitTest(exportCSVGame, 'exportCSVGame');
  
  await myUnitTest(deleteGames, 'deleteGames');
  await myUnitTest(deleteContracts, 'deleteContracts');
  await myUnitTest(deleteProviders, 'deleteProviders');
  await myUnitTest(deleteOperators, 'deleteOperators');
  await myUnitTest(deleteUsers, 'deleteUsers');
  
  await myUnitTest(resetTest, 'resetTest');
}

async function myUnitTest(myFunc, message){
  try{
    console.log("Start Test:" + message);
    await myFunc();
    console.log("End Test:" + message);
  }
  catch(err){
    console.log("Error Test:" + message);
    console.log(err);
  }
}

async function myPostFetchJson(url, data){
  var ret = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  
  //console.log(ret1);
  ret = await ret.json();
  //console.log(ret);
  return ret;
}

async function myPutFetchJson(url, data){
  var ret = await fetch(url, {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  
  //console.log(ret1);
  ret = await ret.json();
  //console.log(ret);
  return ret;
}

async function myGetFetchJson(url){
  var ret = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  ret = await ret.json();
  return ret;
}

async function myGetFetchText(url){
  var ret = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  ret = await ret.text();
  return ret;
}

async function startTest(){
  var url = server2 + "/tests/startTest";
  var text = await myGetFetchText(url);
  expect(text).toBe('startTest');
}

async function myDeleteFetchText(url){
  var ret = await fetch(url, {
    method: 'DELETE',
	headers: headers
  });
  
  ret = await ret.text();
  return ret;
}

async function resetTest(){
  var url = server2 + "/tests/resetTest";
  var res = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  var text = await res.text();
  expect(text).toBe('resetTest');
}

async function testIndex(){
  var url = server1;
  var res = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  var text = await res.text()
  expect(text).toBe('Nexus7995!');
}

async function clearDatabases(){
  await clearTable("games");
  await clearTable("contracts");
  await clearTable("operators");
  await clearTable("providers");
  await clearTable("users");
}

async function clearTable(name){
  var url = server2 + "/" + name + "/tests/clear";
  var res = await fetch(url, {
    method: 'GET',
    headers: headers
  });
  var status = res.status;
  var text = await res.text();
  console.log("\t" + name + ":" + text);
  expect(status).toBe(200);
}

async function createUsers(){
  var ret1 = await myPostFetchJson(server2 + "/users", user1);
  expect(user1.email).toBe(ret1.email);
  user1.id = ret1.id;
  
  var ret2 = await myPostFetchJson(server2 + "/users", user2);
  expect(user2.email).toBe(ret2.email);
  user2.id = ret2.id;
  
  var ret1 = await myPutFetchJson(server2 + "/users", user1);
  expect(user1.id).toBe(ret1.id);
  
  var ret2 = await myPutFetchJson(server2 + "/users", user2);
  expect(user2.id).toBe(ret2.id);
  
  var users = await myGetFetchJson(server1 + "/users");
  expect(users.length).toBe(3); //3 wegen adminUser

  for(var i=0; i<users.length; i++){
    var item = users[i];
    var resItem = await myGetFetchJson(server1 + "/users/" + item.id);
    expect(item.email).toBe(resItem.email);
  }
}

async function createOperators(){
  var ret1 = await myPostFetchJson(server2 + "/operators", operator1);
  expect(operator1.companyName).toBe(ret1.companyName);
  operator1.id = ret1.id;

  var ret2 = await myPostFetchJson(server2 + "/operators", operator2);
  expect(operator2.companyName).toBe(ret2.companyName);
  operator2.id = ret2.id;
  
  var ret1 = await myPutFetchJson(server2 + "/operators", operator1);
  expect(operator1.id).toBe(ret1.id);
  
  var ret2 = await myPutFetchJson(server2 + "/operators", operator2);
  expect(operator2.id).toBe(ret2.id);

  var operators = await myGetFetchJson(server1 + "/operators");
  expect(operators.length).toBe(2);

  for(var i=0; i<operators.length; i++){
    var item = operators[i];
    var resItem = await myGetFetchJson(server1 + "/operators/" + item.id);
    expect(item.companyName).toBe(resItem.companyName);
  }
}

async function createProviders(){
  var ret1 = await myPostFetchJson(server2 + "/providers", provider1);
  expect(provider1.companyName).toBe(ret1.companyName);
  provider1.id = ret1.id;
  
  var ret2 = await myPostFetchJson(server2 + "/providers", provider2);
  expect(provider2.companyName).toBe(ret2.companyName);
  provider2.id = ret2.id;
  
  var ret1 = await myPutFetchJson(server2 + "/providers", provider1);
  expect(provider1.id).toBe(ret1.id);
  
  var ret2 = await myPutFetchJson(server2 + "/providers", provider2);
  expect(provider2.id).toBe(ret2.id);

  var providers = await myGetFetchJson(server1 + "/providers");
  expect(providers.length).toBe(2);

  for(var i=0; i<providers.length; i++){
    var item = providers[i];
    var resItem = await myGetFetchJson(server1 + "/providers/" + item.id);
    expect(item.companyName).toBe(resItem.companyName);
  }
}

async function createContracts(){
  var ret1 = await myPostFetchJson(server1 + "/contracts", contract1);
  expect(contract1.contractName).toBe(ret1.contractName);
  contract1.id = ret1.id;

  var ret2 = await myPostFetchJson(server1 + "/contracts", contract2);
  expect(contract2.contractName).toBe(ret2.contractName);
  contract2.id = ret2.id;
  
  var ret1 = await myPutFetchJson(server1 + "/contracts", contract1);
  expect(contract1.id).toBe(ret1.id);
  
  var ret2 = await myPutFetchJson(server1 + "/contracts", contract2);
  expect(contract2.id).toBe(ret2.id);

  var contracts = await myGetFetchJson(server1 + "/contracts");
  expect(contracts.length).toBe(2);

  for(var i=0; i<contracts.length; i++){
    var item = contracts[i];
    var resItem = await myGetFetchJson(server1 + "/contracts/" + item.id);
    expect(item.contractName).toBe(resItem.contractName);
  }
}

async function createGames(){
  var ret1 = await myPostFetchJson(server1 + "/games", game1);
  expect(game1.gameName).toBe(game1.gameName);
  game1.id = ret1.id;

  var ret2 = await myPostFetchJson(server1 + "/games", game2);
  expect(game2.gameName).toBe(ret2.gameName);
  game2.id = ret2.id;
  
  var ret1 = await myPutFetchJson(server1 + "/games", game1);
  expect(game1.id).toBe(ret1.id);
  
  var ret2 = await myPutFetchJson(server1 + "/games", game2);
  expect(game2.id).toBe(ret2.id);

  var games = await myGetFetchJson(server1 + "/games");
  expect(games.length).toBe(2);

  for(var i=0; i<games.length; i++){
    var item = games[i];
    var resItem = await myGetFetchJson(server1 + "/games/" + item.id);
    expect(item.gameName).toBe(resItem.gameName);
  }
}

async function deleteItems(path, severForDelete){
  var items = await myGetFetchJson(server1 + "/" + path);
  
  for(var i=0; i<items.length; i++){
    var item = items[i];
    var res = await myDeleteFetchText(severForDelete + "/" + path + "/" + item.id);
  }
  
  var items = await myGetFetchJson(server1 + "/" + path);
  if(path != "users") expect(items.length).toBe(0);
}

async function deleteGames(){
  await deleteItems("games", server1);
}

async function deleteContracts(){
  await deleteItems("contracts", server1);
}

async function deleteProviders(){
  await deleteItems("providers", server2);
}

async function deleteOperators(){
  await deleteItems("operators", server2);
}

async function deleteUsers(){
  await deleteItems("users", server2);
}

async function exportCSVGame(){
  var url = server1 + "/publish/" + game1.id;
  var text = await myGetFetchText(url);
  fs.writeFileSync('test.csv', text);
}


mainTest();