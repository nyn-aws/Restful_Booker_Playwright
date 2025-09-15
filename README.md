# Restful Booker Playwright Project

This project automates API and authentication tests for the Restful Booker application using [Playwright](https://playwright.dev/).

## Project Structure

```
playwright.config.ts         # Playwright configuration
package.json                # Project dependencies and scripts
playwright-report/          # Test reports (HTML)
test-results/               # Raw test results

tests/
  authentications/          # Authentication test specs
    auth1.spec.ts
  legacy/                   # Legacy API test specs and data
    api1.spec.ts
    api2.spec.ts
    api3.spec.ts
    api4.spec.ts
    api5.spec.ts
    api6.spec.ts
    api7.spec.ts
    json_request_body1.json # Sample request body
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Restful_Booker_Playwright
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Tests

- To run all tests:
  ```bash
  npx playwright test
  ```
- To run a specific test file:
  ```bash
  npx playwright test tests/authentications/auth1.spec.ts
  ```

### Viewing Reports

- After running tests, open the HTML report:
  ```bash
  npx playwright show-report
  ```
  Or open `playwright-report/index.html` in your browser.

## Folder Details

- `tests/authentications/`: Authentication-related test specs.
- `tests/legacy/`: Legacy API test specs and sample JSON request body.
- `playwright-report/`: Generated test reports.
- `test-results/`: Raw test results for debugging.

## Customization

- Update `playwright.config.ts` to change test settings, base URLs, or timeouts.
- Add new test specs in the `tests/` directory as needed.

## Useful Links

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Node.js Download](https://nodejs.org/)

## License

MIT
