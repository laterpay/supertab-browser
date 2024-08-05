# supertab-browser

Supertab Browser SDK.

## Installation

```bash
npm install @laterpay/supertab-browser
```

## Usage

The supertab-browser instance can be initialized in two ways:

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
