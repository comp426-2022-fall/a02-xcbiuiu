#!/usr/bin/env node
import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));
if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

let timezone = moment.tz.guess();
if(args.z){
    timezone = args.z;
}

let latitude = 0;
let longitude = 0;

if(args.n){
    latitude = args.n;
} else if(args.s){
    latitude = -args.s;
}else{
    console.log('Latitude must be in range');
}

if(args.e){
    longitude = args.e;
}else if(args.w){
    longitude = -args.w;
}else{
    console.log('Longitude must be in range');
}

let days = 1;
if(args.d < 7 && args.d >= 0){
    days = args.d;
}

if (days == 0) {
    console.log("today.")
  } else if (days > 1) {
    console.log("in " + days + " days.")
  } else {
    console.log("tomorrow.")
  }

const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&daily=precipitation_hours&temperature_unit=fahrenheit&timezone=auto`);
const data = await response.json();

if(data.daily.precipitation_hours[days] != 0){
    console.log("You might need your galoshes");
}else{
    console.log("You will not need your galoshes");
}

if(args.j){
    console.log(data);
    process.exit(0);
}