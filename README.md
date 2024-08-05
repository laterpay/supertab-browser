# supertab-browser

Supertab Browser SDK.

## Usage

### Installation

```bash
npm install @laterpay/supertab-browser
```

### Configuration

The supertab-browser instance can be configured with the following options:

#### 1. Using `window` global variables

```javascript
window.SupertabInit(options); // will be available as window.Supertab
console.log(await window.Supertab.getApiVersion()); // will print the version of the API
```

#### 2. Using `Supertab` class

```javascript
const client = new Supertab(options); // will return a Supertab instance
console.log(await client.getApiVersion()); // will print the version of the API
```
