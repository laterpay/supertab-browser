# supertab-browser

Supertab Browser SDK.

## Requirements

This project uses [bun](https://bun.sh/) as the package manager and runtime. Please ensure you have it installed before proceeding.

### NPM Token

To access private packages, you need to set up an NPM_TOKEN in your environment. If you are using the shared token, you can skip this step.

For more information on setting it up, please refer to the [NPM Token Guide](https://laterpay-supertab-docs.readthedocs-hosted.com/en/latest/developers/guides/local-dev/#npm-token).

### Development

After cloning the repository, run the following commands to get started:

1. Install dependencies:

```bash
bun install
```

2. Start the demo:

```bash
bun start
```

This will launch a demo where you can see the response examples and test the Supertab Browser SDK.

3. Note on authentication: Some endpoints in the demo require authentication. Click on the `Auth` button to start the authentication process before using those endpoints.

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
