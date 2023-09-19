import fetch from "node-fetch";
import fs from "fs";
import { expect } from 'expect';

var server = "http://localhost:3002/v1.0";

var bearerToken = null;

var createUser = {
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

var logInUser = {
  email: 'a1@a.de',
  password: 'password1',
};

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

function buildHeaders(){
	var headers = new Headers();
	if(bearerToken != null) headers.append('Authorization', bearerToken);
	headers.append('Content-Type', 'application/json');
	return headers;
}

async function myPostFetchJson(url, data){
  var ret = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: buildHeaders(),
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  
  bearerToken = ret.headers.get('Authorization');
  console.log(bearerToken);
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
    headers: buildHeaders(),
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
    headers: buildHeaders()
  });
  ret = await ret.json();
  return ret;
}

async function myGetFetchText(url){
  var ret = await fetch(url, {
    method: 'GET',
    headers: buildHeaders()
  });
  ret = await ret.text();
  return ret;
}

async function myDeleteFetchText(url){
  var ret = await fetch(url, {
    method: 'DELETE',
	headers: buildHeaders()
  });
  
  ret = await ret.text();
  return ret;
}

async function mainTest(){
  //await myUnitTest(createUsers, 'createUsers');
  await myUnitTest(loginUsers, 'loginUsers');
  //await myUnitTest(testMe, 'testMe');
  //await myUnitTest(listUsers, 'listUsers');
}

async function createUsers(){
  var ret1 = await myPostFetchJson(server + "/auth/register", createUser);
  console.log(ret1);
}

async function loginUsers(){
  var ret1 = await myPostFetchJson(server + "/auth/login", logInUser);
  console.log(ret1);
}

async function testMe(){
  var ret1 = await myGetFetchJson(server + "/auth/me");
  console.log(ret1);
}

async function listUsers(){
  var ret1 = await myGetFetchJson(server + "/users");
  console.log(ret1);
}

mainTest();