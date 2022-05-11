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

# Dydx KEY . Secert . Passphrase 
KEYS = "" 

# Pull Maker Address Balance
PULL_ACCOUNT_INTERVAL = 30
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
KEYS: ""
PUSH_URL: ""
PUSH_TRANSACTION_INTERVAL: 5
PUSH_TRANSACTION_LIMIT: 2
NETWORK_ID: 3
PULL_TRANSACTION_INTERVAL: 30
PULL_ACCOUNT_INTERVAL:30
```
```bash
docker-compose up -d
```
##### Docker run
```bash
docker run --name chainsql -i -t -v $PWD/runtime:/home/www/chainsql/runtime -e KETS=""  chainsql_dydx:latest npm run start
```
### Chainsql built-in tools
#### Develop
```bash
npm link // Install chainsql bin To Global
```
```bash
chainsql
```
- If you feel very troublesome, you can use ts-node ./bin/chainsql.ts or node ./dist/bin/chainsql.js running tool
#### Docker 
- When you compile the project, the system has installed the program globally, and you can use chainsql anywhere
```
chainsql
```

##### After executing the chainsql command, the following welcome content will be printed
```   ___           _       _   _                           _____   _                                       
  / _ \   _ __  | |__   (_) | |_    ___   _ __          |  ___| (_)  _ __     __ _   _ __     ___    ___ 
 | | | | | '__| | '_ \  | | | __|  / _ \ | '__|  _____  | |_    | | | '_ \   / _` | | '_ \   / __|  / _ \
 | |_| | | |    | |_) | | | | |_  |  __/ | |    |_____| |  _|   | | | | | | | (_| | | | | | | (__  |  __/
  \___/  |_|    |_.__/  |_|  \__|  \___| |_|            |_|     |_| |_| |_|  \__,_| |_| |_|  \___|  \___|
                                                                                                         
? What do you want to do? (Use arrow keys)
  ──────────────
❯ PullTransaction 
  PushTransaction 
  Injection Configuration
```
| CMD | Remark  |
| ------ | ------ | ------ |
| PullTransaction | Manually pull the transaction data of block browser  |
| PushTransaction | Manually push transactions to your dashboard  |
| Injection Configuration | For your security, it is recommended that you dynamically inject your private key  |

### Tips
- Build Docker Image
``` bash
docker build -t chainsql_dydx:latest .
```
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