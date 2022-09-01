# FirmaStation Restake API

## How to build
### 1. Install npm

- Install npm modules

  ```bash
  $ npm install
  ```

### 2. Prepare the config file

- Copy config file
  
  ```bash
  $ cp config.sample.ts config.ts
  ```

- Set the variables in config
  ```bash
  MONGODB_URI
   - mongodb://'The address where MongoDB is installed'/'Database name'

  MINIMUM_UFCT_REWARD_AMOUNT
   - Minimum amount of Rewards subject to Restake.
  
  FREQUENCY
   - Determines the scheduling time.
  ```

### 3. Run API

- Start the Restake Scheduler
  ```bash
  # Start according to PRODUCTION_MODE
  $ npm run start

  # start:dev enables the --watch option.
  $ npm run start:dev
  ```