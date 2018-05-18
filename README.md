# GAS Typescript Scaffold

## About

This is a scaffold for writing Google Apps Script in TypeScript and building with webpack.

## Requirements

* Git
* Node.js 8.10.0 or heigher

## Install & Initiation
### Clone Repo
```sh
$ git clone https://github.com/jerrywdlee/typescript-gas-scaffold.git <YOUR-NEW-REPO-NAME>
$ cd <YOUR-NEW-REPO-NAME>
```

### Install packages
```sh
$ npm i
```

### Init Project
```sh
$ npm run init
```

## Usage
### Development

If you watnt to use watch mode,

```sh
$ npm run watch
```

### Deploy
```sh
$ npm build
# Then copy it to your GAS file
# OR Use `gapps upload` if node-google-apps-script installed
# gapps cannot up load Scripts which embedded in Spreadsheets or other files
```

## Notice

- If want connect to Spreadsheets ect. Need run on dev console first and apply permission
- If want update your REST API, need update web app setting after deploy your app

## Reference
[Reffered From Here](https://github.com/naoki-sawada/gas-typescript-webpack.git).  
[node-google-apps-script](https://github.com/danthareja/node-google-apps-script).

## memo
### Json format
```json
{
  "USDJPY": "111.52",
  "CNYJPY": "17.67",
  "EURJPY": "131.97",
  "GBPJPY": "150.76",
  "CHFJPY": "111.99",
  "CADJPY": "87.30",
  "AUDJPY": "83.78",
  "HKDJPY": "14.65",
  "SGDJPY": "83.67",
  "MYRJPY": "29.50",
  "THBJPY": "3.52",
  "MXNJPY": "6.13",
  "TRYJPY": "28.49",
  "ZARJPY": "9.73",
  "DKKJPY": "17.81",
  "NOKJPY": "13.94",
  "SEKJPY": "13.06",
  "KRWJPY": "0.1080",
  "NZDJPY": "77.56",
  "VNDJPY": "0.004878",
  "NPRJPY": "1.03695",
  "PHPJPY": "2.10",
  "sUSDJPY": "0.008967",
  "sCNYJPY": "0.05659309",
  "sEURJPY": "0.00757747",
  "sGBPJPY": "0.00663305",
  "sCHFJPY": "0.00892936",
  "sCADJPY": "0.01145475",
  "sAUDJPY": "0.01193602",
  "sHKDJPY": "0.06825938",
  "sSGDJPY": "0.01195171",
  "sMYRJPY": "0.0338983",
  "sTHBJPY": "0.2840909",
  "sMXNJPY": "0.16313213",
  "sTRYJPY": "0.03510003",
  "sZARJPY": "0.10277492",
  "sDKKJPY": "0.05614823",
  "sNOKJPY": "0.07173601",
  "sSEKJPY": "0.07656967",
  "sKRWJPY": "9.25925925",
  "sNZDJPY": "0.01289324",
  "sVNDJPY": "205.00205002",
  "sNPRJPY": "0.96436665",
  "sPHPJPY": "0.47619047"
}
```