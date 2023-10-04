# supertab-browser

Supertab Browser SDK.

## Development

- `bun install`: Install dependencies
- `bun bundle`: Build the bundle
- `bun dev`: Run build with `--watch` flag
- `bun test`: Run tests
- `bun demo:auth`: Run authentication demo

# Usage

## Installation

> TODO: Add installation instructions using package manager or CDN

## Configuration

The supertab-browser instance can be configured with the following options:

```javascript
//using window global variables
window.SupertabInit(options); //will be available in window.Supertab
console.log(await window.Supertab.getApiVersion()); //will print the version of the API

//using Supertab class
const client = new Supertab(options); //return a Supertab instance
console.log(await client.getApiVersion()); //will print the version of the API
```
