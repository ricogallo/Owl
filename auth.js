var passport = require('passport')
  , local    = require('passport-local').Strategy
  , basic    = require('passport-http').BasicStrategy
  , client   = require('passport-oauth2-client-password').Strategy
  , bearer   = require('passport-http-bearer').Strategy
  , models   = require('./models/');