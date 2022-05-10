# Orbiter-Finance Chainsql

[Hacker News](https://github.com/Orbiter-Finance/chainsql) showcase using typescript && sqlite3

## QuickStart

### Development
##### Local Config .env File
```
# Notification address for receiving push transaction
PUSH_URL = "http://127.0.0.1:3002/notify/dydx" 

# Push transaction interval
PUSH_TRANSACTION_INTERVAL = 5

# Single push transaction quantity
PUSH_TRANSACTION_LIMIT= 2

# DYDX Testnet = 3 Mainet = 1
NETWORK_ID=3

# Pull transaction interval
PULL_TRANSACTION_INTERVAL=30

# Maker Address 
MAKER_ADDRESS=""

# Dydx Api Secert
SECERT=""

# Dydx Api Key
KEY=""

# Dydx Api Passphrase
PASSPHRASE=""
```
##### Develop Run
```bash
$ npm i
$ npm run dev
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run build
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Docker Deploy
##### Docker-Compose 
###### Config Docker Environment Variable
```bash
MAKER_ADDRESS: ""
SECERT: ""
KEY: ""
PASSPHRASE: ""
PUSH_URL: ""
PUSH_TRANSACTION_INTERVAL: 5
PUSH_TRANSACTION_LIMIT: 2
NETWORK_ID: 3
PULL_TRANSACTION_INTERVAL: 30
```
```bash
docker-compose up -d
```
##### Docker run
```bash
docker run --name chainsql -i -t -e MAKER_ADDRESS="" -e SECERT="" -e PASSPHRASE="" -e KEY=""  chainsql_dydx:latest npm run start
```
### Tips
- After modifying the code, you need to rebuild the project
```bash
docker-compose up --detach --build
```
- Delete docker project program
```bash
docker-compose down
```
- Pause docker project program
```bash
docker-compose stop
```
- Restart docker project program
```
docker-compose restart
```
### Requirement

- Node.js 8.x+
- Typescript 2.8+
- Sqlite3