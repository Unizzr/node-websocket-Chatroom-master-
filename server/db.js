const util = require('util');

util.isArray = util.isArray || function isArray(arg) {
  return Array.isArray(arg);
};

util.isDate = util.isDate || function isDate(arg) {
  return Object.prototype.toString.call(arg) === '[object Date]';
};

util.isRegExp = util.isRegExp || function isRegExp(arg) {
  return Object.prototype.toString.call(arg) === '[object RegExp]';
};

util.isBoolean = util.isBoolean || function isBoolean(arg) {
  return typeof arg === 'boolean';
};

util.isNull = util.isNull || function isNull(arg) {
  return arg === null;
};

util.isNullOrUndefined = util.isNullOrUndefined || function isNullOrUndefined(arg) {
  return arg === null || arg === undefined;
};

util.isNumber = util.isNumber || function isNumber(arg) {
  return typeof arg === 'number';
};

util.isString = util.isString || function isString(arg) {
  return typeof arg === 'string';
};

util.isSymbol = util.isSymbol || function isSymbol(arg) {
  return typeof arg === 'symbol';
};

util.isUndefined = util.isUndefined || function isUndefined(arg) {
  return arg === undefined;
};

util.isObject = util.isObject || function isObject(arg) {
  return arg !== null && typeof arg === 'object';
};

util.isFunction = util.isFunction || function isFunction(arg) {
  return typeof arg === 'function';
};

util.isPrimitive = util.isPrimitive || function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||
         typeof arg === 'undefined';
};

const Datastore = require('nedb');
const db={
  user:new Datastore({filename:"./db/users.db",autoload:true}),
  message:new Datastore({filename:"./db/messages.db",autoload:true})
}
module.exports=db;
