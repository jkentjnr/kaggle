# Configuration

- `npm run start`: Evaluates all using existing data / fetches if required.
- `npm run start:force`: Evaluates all forcing a data fetch.
- `npm run start:betfair`: Evaluates all (including Betfair) using existing data / fetches if required.
- `npm run start:tennis`: Evaluates all tennis games forcing a data fetch.

### Running Custom Config

To run a custom config file, execute using the following format:
`babel-node ./scrapper.js --config ./config/config.json`