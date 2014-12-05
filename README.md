# RUUP

[![Build Status](https://travis-ci.org/wookoouk/ruup.svg?branch=master)](https://travis-ci.org/wookoouk/ruup)

> Site monitoring

<img align="right" src="https://raw.githubusercontent.com/wookoouk/ruup/master/public/img/logo.png">

RUUP (R U UP) is a site for monitoring the request response times of sites and getting notifications of their ups and downs.    
 

## TODO
* Admin permissions (who can delete monitors).
* HTML emails.
* Password reset.
* Better job loop system.
* Tests
* Code Coverage

## Depends on
* NodeJS
* NPM
* Bower (`npm install -g bower`)

## Install
copy config-example.json to config.json and edit it    
```
npm install
bower install
```

## Start
```
node app
```