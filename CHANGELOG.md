# [10.1.0](https://github.com/laterpay/supertab-browser/compare/v10.0.2...v10.1.0) (2025-04-10)

### Features

- updates the uiConfig type ([#199](https://github.com/laterpay/supertab-browser/issues/199)) ([46e26e2](https://github.com/laterpay/supertab-browser/commit/46e26e222d25e5ae2ade3b404c66eb314900a5a7))

## [10.0.2](https://github.com/laterpay/supertab-browser/compare/v10.0.1...v10.0.2) (2025-04-07)

### Bug Fixes

- authorize cross-origin window ([#197](https://github.com/laterpay/supertab-browser/issues/197)) ([6242266](https://github.com/laterpay/supertab-browser/commit/624226662f73f565d9567c1a5337997c3f97d882))

## [10.0.1](https://github.com/laterpay/supertab-browser/compare/v10.0.0...v10.0.1) (2025-04-01)

### Bug Fixes

- check for valid content key in the checkAccess ([#196](https://github.com/laterpay/supertab-browser/issues/196)) ([b3837db](https://github.com/laterpay/supertab-browser/commit/b3837db0ad9aaa823ca673f757328109307fcd66))

# [10.0.0](https://github.com/laterpay/supertab-browser/compare/v9.1.1...v10.0.0) (2025-03-17)

### Bug Fixes

- update `formatTab` to use `duration` ([#191](https://github.com/laterpay/supertab-browser/issues/191)) ([a0e4cd1](https://github.com/laterpay/supertab-browser/commit/a0e4cd15bffd7847fe499cb8d9eb86f57a101c2e))

### BREAKING CHANGES

- `purchase` and `getTab` functions now return a tab with `duration` field, removing `recurringDetails` property.

## [9.1.1](https://github.com/laterpay/supertab-browser/compare/v9.1.0...v9.1.1) (2025-03-05)

### Bug Fixes

- cast wrong metadata generated type ([#186](https://github.com/laterpay/supertab-browser/issues/186)) ([e525c5d](https://github.com/laterpay/supertab-browser/commit/e525c5d3e6a86ac6f74fdd07008d4e94aa56af09))

# [9.1.0](https://github.com/laterpay/supertab-browser/compare/v9.0.1...v9.1.0) (2025-03-04)

### Features

- CL-1870 allow to pass metadata to the purchase function ([#184](https://github.com/laterpay/supertab-browser/issues/184)) ([47f184b](https://github.com/laterpay/supertab-browser/commit/47f184b0d8f0e51a00aa21f43a55eecbe3e98aa4))

## [9.0.1](https://github.com/laterpay/supertab-browser/compare/v9.0.0...v9.0.1) (2025-02-28)

### Bug Fixes

- handle scenario when openedWindow.location is undefined ([fdca888](https://github.com/laterpay/supertab-browser/commit/fdca8884499629fa66a7c3457696afabc75131c5))

# [9.0.0](https://github.com/laterpay/supertab-browser/compare/v8.8.4...v9.0.0) (2025-02-24)

### Features

- move from recurring details and time pass details to duration ([#178](https://github.com/laterpay/supertab-browser/issues/178)) ([5009e5d](https://github.com/laterpay/supertab-browser/commit/5009e5dcc9b5e10c592c02cca261d84e6cda1fae))

### BREAKING CHANGES

- Move from recurring_details and time_pass_details to duration

- fix: fix bundle

- chore: fix types

- chore: adjust specs

- chore: specs

- fix: snapshots

## [8.8.4](https://github.com/laterpay/supertab-browser/compare/v8.8.3...v8.8.4) (2025-02-12)

### Bug Fixes

- **CL-1869:** Use full redirect URI from experiences config ([#176](https://github.com/laterpay/supertab-browser/issues/176)) ([5f0916c](https://github.com/laterpay/supertab-browser/commit/5f0916cc93193176fdc2b7179b22a93e4a7118e8))

## [8.8.3](https://github.com/laterpay/supertab-browser/compare/v8.8.2...v8.8.3) (2025-02-12)

### Bug Fixes

- **CL-1869:** default to redirect URI from experience config ([#175](https://github.com/laterpay/supertab-browser/issues/175)) ([e91dc78](https://github.com/laterpay/supertab-browser/commit/e91dc7811e96e52a22b8792cb635a41a6b4e4893))

## [8.8.2](https://github.com/laterpay/supertab-browser/compare/v8.8.1...v8.8.2) (2025-02-04)

### Bug Fixes

- check against subscription id that can be a None string ([#168](https://github.com/laterpay/supertab-browser/issues/168)) ([e26c13e](https://github.com/laterpay/supertab-browser/commit/e26c13e3df204900b6001936f3c863c7f4207049))

## [8.8.1](https://github.com/laterpay/supertab-browser/compare/v8.8.0...v8.8.1) (2025-01-28)

### Bug Fixes

- export types ([fd5269c](https://github.com/laterpay/supertab-browser/commit/fd5269c02491bbdaa854d2038af743e941ea367b))

# [8.8.0](https://github.com/laterpay/supertab-browser/compare/v8.7.4...v8.8.0) (2025-01-28)

### Features

- UiConfig type ([#163](https://github.com/laterpay/supertab-browser/issues/163)) ([4253598](https://github.com/laterpay/supertab-browser/commit/4253598fc5e785c0cc2507af2e5f19780caf9799))

## [8.7.4](https://github.com/laterpay/supertab-browser/compare/v8.7.3...v8.7.4) (2025-01-22)

### Bug Fixes

- format upsell offerings in getExperience ([#162](https://github.com/laterpay/supertab-browser/issues/162)) ([28af5a3](https://github.com/laterpay/supertab-browser/commit/28af5a3e2c3e4e145ed264e86386811b24cf28cd))

## [8.7.3](https://github.com/laterpay/supertab-browser/compare/v8.7.2...v8.7.3) (2025-01-20)

### Bug Fixes

- update tapper-sdk to 18.0.0 ([#161](https://github.com/laterpay/supertab-browser/issues/161)) ([d725e71](https://github.com/laterpay/supertab-browser/commit/d725e7122dbb58f29f299764469df84064f0b91a))

## [8.7.2](https://github.com/laterpay/supertab-browser/compare/v8.7.1...v8.7.2) (2025-01-17)

### Bug Fixes

- return correct price for preferred currency ([#160](https://github.com/laterpay/supertab-browser/issues/160)) ([f4fad67](https://github.com/laterpay/supertab-browser/commit/f4fad67dea8f88da41810b15a9bca18821d6da8f))

## [8.7.1](https://github.com/laterpay/supertab-browser/compare/v8.7.0...v8.7.1) (2025-01-16)

### Bug Fixes

- move away from relying on suggested currency price in offerings ([#158](https://github.com/laterpay/supertab-browser/issues/158)) ([ce6922e](https://github.com/laterpay/supertab-browser/commit/ce6922ee3a3c016ebf128790b1490924a8a844cd)), closes [#159](https://github.com/laterpay/supertab-browser/issues/159)

# [8.7.0](https://github.com/laterpay/supertab-browser/compare/v8.6.0...v8.7.0) (2025-01-15)

### Features

- return `upsells` in experience data ([#156](https://github.com/laterpay/supertab-browser/issues/156)) ([056aeca](https://github.com/laterpay/supertab-browser/commit/056aeca10c733af146f469d33158570557671f7c))

# [8.6.0](https://github.com/laterpay/supertab-browser/compare/v8.5.0...v8.6.0) (2025-01-15)

### Features

- make `checkAccess` accept optional `contentKey` to check access for specific key ([#154](https://github.com/laterpay/supertab-browser/issues/154)) ([f259bd2](https://github.com/laterpay/supertab-browser/commit/f259bd2f547db74a92a0899a75a57676529bb14b))

# [8.5.0](https://github.com/laterpay/supertab-browser/compare/v8.4.1...v8.5.0) (2025-01-15)

### Features

- include product attributes in experience ([#153](https://github.com/laterpay/supertab-browser/issues/153)) ([b8d3003](https://github.com/laterpay/supertab-browser/commit/b8d30039e31c79f7a7645a6966f1a7d76b4cb9f8))

## [8.4.1](https://github.com/laterpay/supertab-browser/compare/v8.4.0...v8.4.1) (2025-01-14)

### Bug Fixes

- make `isoCode` in `getCurrencyDetails` optional ([#150](https://github.com/laterpay/supertab-browser/issues/150)) ([1aac179](https://github.com/laterpay/supertab-browser/commit/1aac1799e5f96b23485ccc620bb8bff9a9a9bbc3))

# [8.4.0](https://github.com/laterpay/supertab-browser/compare/v8.3.0...v8.4.0) (2025-01-13)

### Features

- `.getTabs()` ([#149](https://github.com/laterpay/supertab-browser/issues/149)) ([a51039c](https://github.com/laterpay/supertab-browser/commit/a51039c14319397745b5b33d1c8cb21c68a0276b))

# [8.3.0](https://github.com/laterpay/supertab-browser/compare/v8.2.0...v8.3.0) (2025-01-13)

### Features

- add `getCurrencyDetails` method ([#147](https://github.com/laterpay/supertab-browser/issues/147)) ([5504243](https://github.com/laterpay/supertab-browser/commit/5504243ab711e2522e77ec02b56dfe421b49fd5d))

# [8.2.0](https://github.com/laterpay/supertab-browser/compare/v8.1.2...v8.2.0) (2025-01-09)

### Features

- return experience and site data ([#145](https://github.com/laterpay/supertab-browser/issues/145)) ([a778954](https://github.com/laterpay/supertab-browser/commit/a778954b611ba612cb3d5326663b05323cd68ed0))

## [8.1.2](https://github.com/laterpay/supertab-browser/compare/v8.1.1...v8.1.2) (2024-11-18)

### Bug Fixes

- close the document after write to prevent "sticky" window ([f9b0165](https://github.com/laterpay/supertab-browser/commit/f9b0165245c61fd3ebf188bfd0e1bd13f2dc10b9))

## [8.1.1](https://github.com/laterpay/supertab-browser/compare/v8.1.0...v8.1.1) (2024-11-18)

### Bug Fixes

- disable pre-fetching of desired window location ([9bc4452](https://github.com/laterpay/supertab-browser/commit/9bc4452bd49162e631c7b9d38ec03a788ed02a66))

# [8.1.0](https://github.com/laterpay/supertab-browser/compare/v8.0.2...v8.1.0) (2024-11-18)

### Features

- Include purchase ids in `purchase` method response ([#122](https://github.com/laterpay/supertab-browser/issues/122)) ([6958cfd](https://github.com/laterpay/supertab-browser/commit/6958cfd445cc86f0e144ef4d736947736ea45a72))

## [8.0.2](https://github.com/laterpay/supertab-browser/compare/v8.0.1...v8.0.2) (2024-11-14)

### Bug Fixes

- set window location if fails to fetch URL ([a0b449b](https://github.com/laterpay/supertab-browser/commit/a0b449bd4e88e23b99157af24839610c668f5dcb))

## [8.0.1](https://github.com/laterpay/supertab-browser/compare/v8.0.0...v8.0.1) (2024-11-05)

### Bug Fixes

- package dependencies ([#110](https://github.com/laterpay/supertab-browser/issues/110)) ([a9ee94d](https://github.com/laterpay/supertab-browser/commit/a9ee94d317b2dc69438ff09381a909812e53935d))

# [8.0.0](https://github.com/laterpay/supertab-browser/compare/v7.0.0...v8.0.0) (2024-11-01)

### Features

- use `purchaseOutcome` field ([#105](https://github.com/laterpay/supertab-browser/issues/105)) ([370835d](https://github.com/laterpay/supertab-browser/commit/370835d7594526046ebf2f05a5937b3d87af2eb6))

### BREAKING CHANGES

- `purchaseStatus` in `.purchase` method is renamed to `purchaseOutcome`.

# [7.0.0](https://github.com/laterpay/supertab-browser/compare/v6.13.0...v7.0.0) (2024-10-31)

### feature

- Include more currency details in offerings and tabs ([#104](https://github.com/laterpay/supertab-browser/issues/104)) ([c9eefa5](https://github.com/laterpay/supertab-browser/commit/c9eefa5498c7412e1f56b27228037a057c6b49ed))

### BREAKING CHANGES

- Change currency type from `string` (isoCode) to `object` (isoCode, baseUnit)

## Details

Offerings, tabs and tab purchases now contain more currency details in the form of an object. Before, they contained just the currency iso code string.

```typescript
type PublicCurrencyDetails = Pick<Currency, "isoCode" | "baseUnit">;

// Example
const currency: PublicCurrencyDetails = {
  isoCode: "USD",
  baseUnit: 100,
};
```

## Why

We're implementing Google's Monetization Provider API for experiences.js and we need to know the currency's base unit for the response data.

## Changes

- **fix: Correct typo in STG token URL**
- **Add missing data to mock user**
- **Include currency isoCode and baseUnit in offerings**
- **Include currency iso code and base unit in tabs**
- **Fix inconsitent currency handling in test mock api**

# [6.13.0](https://github.com/laterpay/supertab-browser/compare/v6.12.7...v6.13.0) (2024-10-04)

### Features

- return `purchaseStatus` in `.purchase()` ([#94](https://github.com/laterpay/supertab-browser/issues/94)) ([13eae65](https://github.com/laterpay/supertab-browser/commit/13eae65636a29242f8db50560ec35bb33af2e22e))

## [6.12.7](https://github.com/laterpay/supertab-browser/compare/v6.12.6...v6.12.7) (2024-09-27)

### Bug Fixes

- Correct typo in STG token URL ([#76](https://github.com/laterpay/supertab-browser/issues/76)) ([140651c](https://github.com/laterpay/supertab-browser/commit/140651cc03a1da4008e1ad1477b23d9669e406bc))

## [6.12.6](https://github.com/laterpay/supertab-browser/compare/v6.12.5...v6.12.6) (2024-09-27)

### Bug Fixes

- Don't require full tab before payment ([#75](https://github.com/laterpay/supertab-browser/issues/75)) ([4333b1c](https://github.com/laterpay/supertab-browser/commit/4333b1ce4eae12b43dc90b7cb49783c5f1b1b556))

## [6.12.5](https://github.com/laterpay/supertab-browser/compare/v6.12.4...v6.12.5) (2024-09-09)

### Bug Fixes

- Switch back to Hydra auth endpoint on PROD ([#74](https://github.com/laterpay/supertab-browser/issues/74)) ([e924571](https://github.com/laterpay/supertab-browser/commit/e92457141faf49ebbf950cef1844589eaacf0e40))

## [6.12.4](https://github.com/laterpay/supertab-browser/compare/v6.12.3...v6.12.4) (2024-09-05)

### Bug Fixes

- missing release again... ([#73](https://github.com/laterpay/supertab-browser/issues/73)) ([00eac9d](https://github.com/laterpay/supertab-browser/commit/00eac9da68fb5848340533da485ac91b056cc467))

## [6.12.3](https://github.com/laterpay/supertab-browser/compare/v6.12.2...v6.12.3) (2024-09-03)

### Bug Fixes

- Switch back to Hydra auth endpoint on SBX ([#70](https://github.com/laterpay/supertab-browser/issues/70)) ([408220f](https://github.com/laterpay/supertab-browser/commit/408220f43a1d13dad041d143ec64e61751a87012))

## [6.12.2](https://github.com/laterpay/supertab-browser/compare/v6.12.1...v6.12.2) (2024-08-22)

### Bug Fixes

- Switch to supertab.co domain on SBX ([#63](https://github.com/laterpay/supertab-browser/issues/63)) ([cea41b5](https://github.com/laterpay/supertab-browser/commit/cea41b51fd4270ca724a10ecceae0463c051a3dc))

## [6.12.1](https://github.com/laterpay/supertab-browser/compare/v6.12.0...v6.12.1) (2024-08-22)

### Bug Fixes

- create a new release after [#68](https://github.com/laterpay/supertab-browser/issues/68) ([#69](https://github.com/laterpay/supertab-browser/issues/69)) ([6c5a93c](https://github.com/laterpay/supertab-browser/commit/6c5a93c92c186b1f04fc51c08d967b1675f42608))

# [6.12.0](https://github.com/laterpay/supertab-browser/compare/v6.11.1...v6.12.0) (2024-08-19)

### Bug Fixes

- use `NPM_TOKEN` for CI ([86228b2](https://github.com/laterpay/supertab-browser/commit/86228b29c36a605f3f9d667b3c8819709b37cca5))

### Features

- use [@getsupertab](https://github.com/getsupertab) scope and host on npm ([#67](https://github.com/laterpay/supertab-browser/issues/67)) ([af0ce1d](https://github.com/laterpay/supertab-browser/commit/af0ce1d37294326ec29bde2773d05d0226914489))

## [6.11.1](https://github.com/laterpay/supertab-browser/compare/v6.11.0...v6.11.1) (2024-08-14)

### Bug Fixes

- Refactor connected subscription logic to fix TypeScript issue ([#66](https://github.com/laterpay/supertab-browser/issues/66)) ([d335205](https://github.com/laterpay/supertab-browser/commit/d3352052cdae31232f9a594f04a6c89f46f71297))

# [6.11.0](https://github.com/laterpay/supertab-browser/compare/v6.10.0...v6.11.0) (2024-08-13)

### Features

- Expose connected subscription offerings ([#65](https://github.com/laterpay/supertab-browser/issues/65)) ([8ae9b5f](https://github.com/laterpay/supertab-browser/commit/8ae9b5ff011912edc37a710cf936db5b32429b4d))

# [6.10.0](https://github.com/laterpay/supertab-browser/compare/v6.9.1...v6.10.0) (2024-08-07)

### Features

- improve bundler config to include external deps ([92b702f](https://github.com/laterpay/supertab-browser/commit/92b702f6bf7151f3c03efba7ab4d9c1d98107a81))

## [6.9.1](https://github.com/laterpay/supertab-browser/compare/v6.9.0...v6.9.1) (2024-08-07)

### Bug Fixes

- do not include sourcemap in the prod build ([1e58d0d](https://github.com/laterpay/supertab-browser/commit/1e58d0dea3c95a73f8222e51003053555e64e993))

# [6.9.0](https://github.com/laterpay/supertab-browser/compare/v6.8.0...v6.9.0) (2024-08-06)

### Features

- dynamically load omega animation ([01d16b3](https://github.com/laterpay/supertab-browser/commit/01d16b36309500d1dadc0ca07a9c2b81f53a16c4))

# [6.8.0](https://github.com/laterpay/supertab-browser/compare/v6.7.5...v6.8.0) (2024-08-06)

### Features

- version bump ([dd91f7a](https://github.com/laterpay/supertab-browser/commit/dd91f7a39d5395b25028822c2963580563af95db))

## [6.7.5](https://github.com/laterpay/supertab-browser/compare/v6.7.4...v6.7.5) (2024-08-06)

### Bug Fixes

- make npm publish script unscoped ([890f3e6](https://github.com/laterpay/supertab-browser/commit/890f3e6ea51e0ea126cf75f5946c0bcef2c9c0c9))

## [6.7.4](https://github.com/laterpay/supertab-browser/compare/v6.7.3...v6.7.4) (2024-08-06)

### Bug Fixes

- add scoped registry for npm ([ca7fd6d](https://github.com/laterpay/supertab-browser/commit/ca7fd6dc5f2f2b1aef2854a7290862517a7d8f05))
- registry urls ([fd737ec](https://github.com/laterpay/supertab-browser/commit/fd737ec0b8739d70dd056d1e46a134ba6d1b3f95))

## [6.7.3](https://github.com/laterpay/supertab-browser/compare/v6.7.2...v6.7.3) (2024-08-06)

### Bug Fixes

- add ci step to publish to npm ([0cd17b4](https://github.com/laterpay/supertab-browser/commit/0cd17b4abfc25af810b0fea94ae61082120f952d))
- use npmjs.org registry ([9b33d4f](https://github.com/laterpay/supertab-browser/commit/9b33d4f1ddd8d81a2a0ee0cb6815e05f21d997b8))

## [6.7.2](https://github.com/laterpay/supertab-browser/compare/v6.7.1...v6.7.2) (2024-08-06)

### Bug Fixes

- remove additional invokation of semantic-release/npm ([6f5bb1c](https://github.com/laterpay/supertab-browser/commit/6f5bb1c347cf219bd36e5fa259cf633f1d28d0c3))

## [6.7.1](https://github.com/laterpay/supertab-browser/compare/v6.7.0...v6.7.1) (2024-08-06)

### Bug Fixes

- auth token env var ([38167f7](https://github.com/laterpay/supertab-browser/commit/38167f7d7ca36698486a0d7faad5dd952028fb36))

# [6.7.0](https://github.com/laterpay/supertab-browser/compare/v6.6.0...v6.7.0) (2024-08-06)

### Bug Fixes

- consolidate registries ([2ab71ce](https://github.com/laterpay/supertab-browser/commit/2ab71ce5ad1552f2aab184ff2fceb54643647fce))

### Features

- publish to npm registry ([8c058ff](https://github.com/laterpay/supertab-browser/commit/8c058ffea67dd2eb2ba34ecf579cbf163d81af10))

# [6.6.0](https://github.com/laterpay/supertab-browser/compare/v6.5.0...v6.6.0) (2024-08-06)

### Features

- bump version ([55c167c](https://github.com/laterpay/supertab-browser/commit/55c167cbf09103f678ec9736d659fa1fd1e908be))

# [6.5.0](https://github.com/laterpay/supertab-browser/compare/v6.4.0...v6.5.0) (2024-08-06)

### Features

- add new version ([4264857](https://github.com/laterpay/supertab-browser/commit/426485729ae5498064a1c1db18470df83d3e1c26))

# [6.4.0](https://github.com/laterpay/supertab-browser/compare/v6.3.0...v6.4.0) (2024-08-05)

### Features

- make package public ([daf408c](https://github.com/laterpay/supertab-browser/commit/daf408cb6ecca80bfad95abfc34fd2d9aa909b52))

# [6.3.0](https://github.com/laterpay/supertab-browser/compare/v6.2.0...v6.3.0) (2024-07-30)

### Features

- Add explicit auth and token urls ([#62](https://github.com/laterpay/supertab-browser/issues/62)) ([52896b1](https://github.com/laterpay/supertab-browser/commit/52896b1e5f8d8fb15e0936abd201a4e9c6cf0c72))

# [6.2.0](https://github.com/laterpay/supertab-browser/compare/v6.1.0...v6.2.0) (2024-07-16)

### Bug Fixes

- test cases ([68c5d3d](https://github.com/laterpay/supertab-browser/commit/68c5d3dc552bb6954e1409485818a925e4ab92df))

### Features

- add tests for tab payment model ([cefbfd0](https://github.com/laterpay/supertab-browser/commit/cefbfd0dc9526a90e9e696110b275e9bf9b857ad))
- include payment model in tab response ([9208857](https://github.com/laterpay/supertab-browser/commit/920885790ab7ec7d7f16e5f08adc0235ce77145c))

# [6.1.0](https://github.com/laterpay/supertab-browser/compare/v6.0.1...v6.1.0) (2024-07-03)

### Features

- Add new public method `openCheckoutWindow` ([#61](https://github.com/laterpay/supertab-browser/issues/61)) ([ed45813](https://github.com/laterpay/supertab-browser/commit/ed4581350a54bd6efed9f025c88bd4e82bf5431d))

## [6.0.1](https://github.com/laterpay/supertab-browser/compare/v6.0.0...v6.0.1) (2024-07-01)

### Bug Fixes

- Increase checkout window width to fit Stripe subscription form ([#60](https://github.com/laterpay/supertab-browser/issues/60)) ([b333137](https://github.com/laterpay/supertab-browser/commit/b333137c07ed787ae35610365dd42179e26ab6f7))

# [6.0.0](https://github.com/laterpay/supertab-browser/compare/v5.5.0...v6.0.0) (2024-06-21)

### Features

- Normalize tab formatting ([#59](https://github.com/laterpay/supertab-browser/issues/59)) ([7d291d0](https://github.com/laterpay/supertab-browser/commit/7d291d0e6a9b05c9ace10a2037361629fe3639d4))

### BREAKING CHANGES

- Format the reponse of `payTab`, too (it was returning
  the raw TabResponse before)
- Return `null` instead of `undefined` from `getTab` if
  no open Tab was found.

* Narrow down response types of the above methods
* Add "status" property to the response of `payTab`. It can be `success`
  or `error` and makes handling the responses on the consuming end more
  fun.

# [5.5.0](https://github.com/laterpay/supertab-browser/compare/v5.4.0...v5.5.0) (2024-06-20)

### Features

- Add timepass and subscription details to offerings ([#57](https://github.com/laterpay/supertab-browser/issues/57)) ([aa382c7](https://github.com/laterpay/supertab-browser/commit/aa382c7616731344bbfc20a93be210de6ac6a4d5))

# [5.4.0](https://github.com/laterpay/supertab-browser/compare/v5.3.0...v5.4.0) (2024-06-20)

### Features

- Add flag `isSubscription` to return value of method `checkAccess` ([#56](https://github.com/laterpay/supertab-browser/issues/56)) ([dade8c6](https://github.com/laterpay/supertab-browser/commit/dade8c6aa8df00915df5e34b32b86b9d262bf3f8))

# [5.3.0](https://github.com/laterpay/supertab-browser/compare/v5.2.0...v5.3.0) (2024-06-19)

### Features

- Include payment model in offerings ([#55](https://github.com/laterpay/supertab-browser/issues/55)) ([9926420](https://github.com/laterpay/supertab-browser/commit/99264208ba13312ad1c557f8f9d5951c5126c3d2))

# [5.2.0](https://github.com/laterpay/supertab-browser/compare/v5.1.0...v5.2.0) (2024-06-05)

### Features

- allow calling getOfferings() in no-auth context ([16e8840](https://github.com/laterpay/supertab-browser/commit/16e8840c3aebb56d0da3f00b6346f97f0ad1802c))

# [5.1.0](https://github.com/laterpay/supertab-browser/compare/v5.0.0...v5.1.0) (2024-05-28)

### Features

- update tapper-sdk client to v37.0.0 ([08691ec](https://github.com/laterpay/supertab-browser/commit/08691ec5f152b5f49d27371614b68c106dc1289e))

# [5.0.0](https://github.com/laterpay/supertab-browser/compare/v4.7.0...v5.0.0) (2024-05-28)

### Features

- make `checkAccess()` responses more sensible ([#54](https://github.com/laterpay/supertab-browser/issues/54)) ([abbfb9c](https://github.com/laterpay/supertab-browser/commit/abbfb9c83ae4fcbe0c0e52632488b5ddeb2d5502))

### BREAKING CHANGES

- checkAccess() response was modified. It now returns access object with validTo property if access is found. If no access, the access is set to null.

# [4.7.0](https://github.com/laterpay/supertab-browser/compare/v4.6.0...v4.7.0) (2024-05-14)

### Features

- preload URLs for new windows only ([#53](https://github.com/laterpay/supertab-browser/issues/53)) ([5bbb22f](https://github.com/laterpay/supertab-browser/commit/5bbb22f08cc934e8ee57c85daddccd08a9b6bb54))

# [4.6.0](https://github.com/laterpay/supertab-browser/compare/v4.5.2...v4.6.0) (2024-04-30)

### Features

- Add optional constructor param `systemUrls` ([#52](https://github.com/laterpay/supertab-browser/issues/52)) ([5c34626](https://github.com/laterpay/supertab-browser/commit/5c346269aaf2183a545aa831ace9eb64b0d980af))

## [4.5.2](https://github.com/laterpay/supertab-browser/compare/v4.5.1...v4.5.2) (2024-04-24)

### Bug Fixes

- return type of .payTab() ([6648800](https://github.com/laterpay/supertab-browser/commit/664880097de9e74d9b48d1cbeed3c1c5005c20a1))

## [4.5.1](https://github.com/laterpay/supertab-browser/compare/v4.5.0...v4.5.1) (2024-04-24)

### Bug Fixes

- return type of .payTab ([31dac44](https://github.com/laterpay/supertab-browser/commit/31dac4485455ddfd29ba215029271e74bb4d044d))

# [4.5.0](https://github.com/laterpay/supertab-browser/compare/v4.4.3...v4.5.0) (2024-04-22)

### Features

- add formatAmount function for formatting price ([f2b0158](https://github.com/laterpay/supertab-browser/commit/f2b0158e13855ca0320eb2f2698878c03a6e536c))

## [4.4.3](https://github.com/laterpay/supertab-browser/compare/v4.4.2...v4.4.3) (2024-04-19)

### Bug Fixes

- do not show zero fraction digits in tab limit formatted amount ([c8f5e18](https://github.com/laterpay/supertab-browser/commit/c8f5e185f3e239478ecf9970a9de7b9f9b8e7792))

## [4.4.2](https://github.com/laterpay/supertab-browser/compare/v4.4.1...v4.4.2) (2024-04-19)

### Bug Fixes

- make purchase in suggested currency if tab is undefined and preferred currency not set ([01f9bba](https://github.com/laterpay/supertab-browser/commit/01f9bba816b638fbd4b9df783b276448a551cb22))

## [4.4.1](https://github.com/laterpay/supertab-browser/compare/v4.4.0...v4.4.1) (2024-04-19)

### Bug Fixes

- expose missing tab limit.text in purchase response ([4e4d979](https://github.com/laterpay/supertab-browser/commit/4e4d979556a6fce1539385dc02dedfb79ccdbdea))

# [4.4.0](https://github.com/laterpay/supertab-browser/compare/v4.3.0...v4.4.0) (2024-04-19)

### Features

- return tab limit as an object ([e9edafd](https://github.com/laterpay/supertab-browser/commit/e9edafdc8d2f34f1e8f0f92067ad3c424c9ae6b7))

# [4.3.0](https://github.com/laterpay/supertab-browser/compare/v4.2.1...v4.3.0) (2024-04-19)

### Features

- return offerings in tab currency if tab is found ([20d6f42](https://github.com/laterpay/supertab-browser/commit/20d6f4209917ff7d0ede4dca7295c75076534ecb))

## [4.2.1](https://github.com/laterpay/supertab-browser/compare/v4.2.0...v4.2.1) (2024-04-19)

### Bug Fixes

- return object for the `tab.total` in purchase response ([2459a93](https://github.com/laterpay/supertab-browser/commit/2459a93ba560555a9ec6ca34f7cbd8673a495173))

# [4.2.0](https://github.com/laterpay/supertab-browser/compare/v4.1.0...v4.2.0) (2024-04-19)

### Features

- include formatted price in tab and purchases ([#51](https://github.com/laterpay/supertab-browser/issues/51)) ([10c135e](https://github.com/laterpay/supertab-browser/commit/10c135e93a0dba42926d09cf4d8e1030117deed6))

# [4.1.0](https://github.com/laterpay/supertab-browser/compare/v4.0.0...v4.1.0) (2024-04-17)

### Bug Fixes

- return preferred currency code ([4611585](https://github.com/laterpay/supertab-browser/commit/4611585d6f395ae3cf513212b359acc08e37325f))

### Features

- return entire price object for the offerings ([7d946cd](https://github.com/laterpay/supertab-browser/commit/7d946cd76b7c8600ac5ce579c57a34129fc6f14f))

# [4.0.0](https://github.com/laterpay/supertab-browser/compare/v3.0.6...v4.0.0) (2024-04-16)

### Features

- add multicurrency support ([#49](https://github.com/laterpay/supertab-browser/issues/49)) ([fb448b4](https://github.com/laterpay/supertab-browser/commit/fb448b4017757d333c354db47eeadd0ed0eef936))

### BREAKING CHANGES

- `purchase()` function's `preferredCurrency` parameter renamed to `preferredCurrencyCode` to unify the naming.
- Removed `?currency=USD` from the client config call. This can break integrations that do not have offerings created in all prices (shouldn't occur in production, but can break some client apps created by hand by us across envs).

## [3.0.6](https://github.com/laterpay/supertab-browser/compare/v3.0.5...v3.0.6) (2024-04-11)

### Bug Fixes

- make payTab return Promise<any> ([e969e7b](https://github.com/laterpay/supertab-browser/commit/e969e7bee5718e4a8da2082b56734c6cc20418f4))

## [3.0.5](https://github.com/laterpay/supertab-browser/compare/v3.0.4...v3.0.5) (2024-02-26)

### Bug Fixes

- bring the prefetching back ([5a83070](https://github.com/laterpay/supertab-browser/commit/5a830702ad7e9a41e8cdd39ebde68650c4b68346))

## [3.0.4](https://github.com/laterpay/supertab-browser/compare/v3.0.3...v3.0.4) (2024-02-22)

### Bug Fixes

- temporarily disable prefetching to avoid CORS issues ([#48](https://github.com/laterpay/supertab-browser/issues/48)) ([fd9794d](https://github.com/laterpay/supertab-browser/commit/fd9794d7ff3686d54172e80616da84e986e91b1f))

## [3.0.3](https://github.com/laterpay/supertab-browser/compare/v3.0.2...v3.0.3) (2024-02-22)

### Bug Fixes

- safer dom manipulation for loading animation ([#47](https://github.com/laterpay/supertab-browser/issues/47)) ([da2c5cb](https://github.com/laterpay/supertab-browser/commit/da2c5cbfe0bfd038b6d62d3463e27e4070fb442e))

## [3.0.2](https://github.com/laterpay/supertab-browser/compare/v3.0.1...v3.0.2) (2024-02-21)

### Bug Fixes

- catch errors in promise when pre-fetching URLs and let it fail silently ([2b7396b](https://github.com/laterpay/supertab-browser/commit/2b7396b87469a147ede0831c3508bf3f5fc9d926))

## [3.0.1](https://github.com/laterpay/supertab-browser/compare/v3.0.0...v3.0.1) (2024-02-08)

### Bug Fixes

- add viewport tag to opened windows to fix scaling ([#45](https://github.com/laterpay/supertab-browser/issues/45)) ([7567e4a](https://github.com/laterpay/supertab-browser/commit/7567e4a5db1e04d73941b9a7f73922ca7bfcc8a6))

# [3.0.0](https://github.com/laterpay/supertab-browser/compare/v2.2.0...v3.0.0) (2024-02-06)

### Features

- new function names ([#46](https://github.com/laterpay/supertab-browser/issues/46)) ([fd11a60](https://github.com/laterpay/supertab-browser/commit/fd11a607098a96cd19427eb05314c951723e4448))

### BREAKING CHANGES

- Function names have been updated.

- `auth` is now `authorize`.
- `getCurrentUser` is now `getUser`.
- `getUserTab` is now `getTab`.
- `pay` is now `payTab`.
- `openPersonalMarketingPage` is now `openAboutSupertab`.

# [2.2.0](https://github.com/laterpay/supertab-browser/compare/v2.1.0...v2.2.0) (2024-01-31)

### Features

- preload popup url using fetch ([#44](https://github.com/laterpay/supertab-browser/issues/44)) ([a865605](https://github.com/laterpay/supertab-browser/commit/a865605de6204decec08bc7152cf0a2cbf0c5ef7))

# [2.1.0](https://github.com/laterpay/supertab-browser/compare/v2.0.0...v2.1.0) (2024-01-30)

### Features

- create static loading state ([#39](https://github.com/laterpay/supertab-browser/issues/39)) ([0b8c0fb](https://github.com/laterpay/supertab-browser/commit/0b8c0fbe22ec1ad06c90b678341c55e37b43bdd7))

# [2.0.0](https://github.com/laterpay/supertab-browser/compare/v1.13.0...v2.0.0) (2024-01-29)

### Features

- resolve promise on window close ([#42](https://github.com/laterpay/supertab-browser/issues/42)) ([594dc23](https://github.com/laterpay/supertab-browser/commit/594dc23502e27a1818ace803ab43dd043a96398d))

### BREAKING CHANGES

- Closed windows no longer throw errors but resolve the promise with `{ error: "Window closed" }` instead.

# [1.13.0](https://github.com/laterpay/supertab-browser/compare/v1.12.1...v1.13.0) (2024-01-25)

### Features

- add build for stg tapper environment ([#43](https://github.com/laterpay/supertab-browser/issues/43)) ([57d6d7b](https://github.com/laterpay/supertab-browser/commit/57d6d7befc36cc7bd82d809d94ac0385c5a3f850))

## [1.12.1](https://github.com/laterpay/supertab-browser/compare/v1.12.0...v1.12.1) (2024-01-19)

### Bug Fixes

- send scope in the refresh token flow ([#41](https://github.com/laterpay/supertab-browser/issues/41)) ([e4e13d2](https://github.com/laterpay/supertab-browser/commit/e4e13d2c8c5a174b84260d957fc22830aa68455c))

# [1.12.0](https://github.com/laterpay/supertab-browser/compare/v1.11.0...v1.12.0) (2024-01-09)

### Features

- `openPersonalMarketingPage()` ([#40](https://github.com/laterpay/supertab-browser/issues/40)) ([369d0b5](https://github.com/laterpay/supertab-browser/commit/369d0b5bfe15fc7286df432e608188ca2ab831aa))

# [1.11.0](https://github.com/laterpay/supertab-browser/compare/v1.10.1...v1.11.0) (2023-12-22)

### Features

- Improve and fix argument types of method `auth` ([#38](https://github.com/laterpay/supertab-browser/issues/38)) ([5b002e7](https://github.com/laterpay/supertab-browser/commit/5b002e775a36f37173735baee91a160a44d5be7d))

## [1.10.1](https://github.com/laterpay/supertab-browser/compare/v1.10.0...v1.10.1) (2023-12-21)

### Bug Fixes

- Use origin instead of href when creating the redirect uri ([#37](https://github.com/laterpay/supertab-browser/issues/37)) ([d10cd39](https://github.com/laterpay/supertab-browser/commit/d10cd391dca11a2ca3ae8e4ecee217e7c0ba2428))

# [1.10.0](https://github.com/laterpay/supertab-browser/compare/v1.9.0...v1.10.0) (2023-12-21)

### Features

- Add suppport for testmode: true to pay method ([#36](https://github.com/laterpay/supertab-browser/issues/36)) ([ba7436f](https://github.com/laterpay/supertab-browser/commit/ba7436f50d29a5c8dca724113e04bd0d36154d39))

# [1.9.0](https://github.com/laterpay/supertab-browser/compare/v1.8.0...v1.9.0) (2023-12-20)

### Features

- pass `usd` for currency param in config ([#34](https://github.com/laterpay/supertab-browser/issues/34)) ([4794d85](https://github.com/laterpay/supertab-browser/commit/4794d85616bfe1c75f9c78cdebc319f751b61d67))
- return `salesModel` for offerings ([#35](https://github.com/laterpay/supertab-browser/issues/35)) ([2bff6da](https://github.com/laterpay/supertab-browser/commit/2bff6daee307f5291bd5168e2e1e47e4e17dfd1b))

# [1.8.0](https://github.com/laterpay/supertab-browser/compare/v1.7.0...v1.8.0) (2023-12-18)

### Features

- include offerings.prices ([#33](https://github.com/laterpay/supertab-browser/issues/33)) ([6ef5d82](https://github.com/laterpay/supertab-browser/commit/6ef5d826e35ece6ab196948469aad71fefd7889c))

# [1.7.0](https://github.com/laterpay/supertab-browser/compare/v1.6.0...v1.7.0) (2023-12-15)

### Features

- improved window handling ([#31](https://github.com/laterpay/supertab-browser/issues/31)) ([1bf2eaf](https://github.com/laterpay/supertab-browser/commit/1bf2eaf26b347eeb85956fa55a84c5dd7ffcf1af))

# [1.6.0](https://github.com/laterpay/supertab-browser/compare/v1.5.0...v1.6.0) (2023-12-15)

### Features

- make `silently` optional in `auth` function ([#30](https://github.com/laterpay/supertab-browser/issues/30)) ([a314866](https://github.com/laterpay/supertab-browser/commit/a314866badc9a56031025808fe3bed7ed715d08d))

# [1.5.0](https://github.com/laterpay/supertab-browser/compare/v1.4.0...v1.5.0) (2023-12-14)

### Features

- open SSO and Checkout in popup ([#29](https://github.com/laterpay/supertab-browser/issues/29)) ([fb04a12](https://github.com/laterpay/supertab-browser/commit/fb04a127c9449a6d810624be9da0b51fa7ba2301))

# [1.4.0](https://github.com/laterpay/supertab-browser/compare/v1.3.6...v1.4.0) (2023-12-13)

### Features

- handle 402 for .purchase ([#28](https://github.com/laterpay/supertab-browser/issues/28)) ([b548a6b](https://github.com/laterpay/supertab-browser/commit/b548a6b9be694ec9bb5a57c87634f848346d2369))

## [1.3.6](https://github.com/laterpay/supertab-browser/compare/v1.3.5...v1.3.6) (2023-12-08)

### Bug Fixes

- add OAuth2 scopes ([#27](https://github.com/laterpay/supertab-browser/issues/27)) ([61d28d6](https://github.com/laterpay/supertab-browser/commit/61d28d642851cdab3e017b951d7fdb05baaae1d2))

## [1.3.5](https://github.com/laterpay/supertab-browser/compare/v1.3.4...v1.3.5) (2023-12-07)

### Bug Fixes

- require `build` and `test` before `release` ([9c02202](https://github.com/laterpay/supertab-browser/commit/9c02202ec1a1e941a5cc77fe6e43f56406bc0ad7))

## [1.3.4](https://github.com/laterpay/supertab-browser/compare/v1.3.3...v1.3.4) (2023-12-07)

### Bug Fixes

- persist to workspace ([be196f2](https://github.com/laterpay/supertab-browser/commit/be196f29af89963170248109ca81cec4648397df))

## [1.3.3](https://github.com/laterpay/supertab-browser/compare/v1.3.2...v1.3.3) (2023-12-07)

### Bug Fixes

- attach workspace in release job ([0ed7a12](https://github.com/laterpay/supertab-browser/commit/0ed7a127d85bd49863d83853f3d245dd9cad0d54))

## [1.3.2](https://github.com/laterpay/supertab-browser/compare/v1.3.1...v1.3.2) (2023-12-07)

### Bug Fixes

- persist `dist/` to the workspace ([031ddc6](https://github.com/laterpay/supertab-browser/commit/031ddc6b10e8f937f5f8b241e8ad7fafc8d04c66))

## [1.3.1](https://github.com/laterpay/supertab-browser/compare/v1.3.0...v1.3.1) (2023-12-07)

### Bug Fixes

- Correct semver syntax error in peer dependency ([#26](https://github.com/laterpay/supertab-browser/issues/26)) ([4b88d45](https://github.com/laterpay/supertab-browser/commit/4b88d456da5c8b1c9fd09a82d1a7f58178adcefe))

# [1.3.0](https://github.com/laterpay/supertab-browser/compare/v1.2.0...v1.3.0) (2023-12-07)

### Features

- bump version to avoid conflict ([5a7a354](https://github.com/laterpay/supertab-browser/commit/5a7a354c7d5c9196828f26003064f47ec700b60c))

# [1.2.0](https://github.com/laterpay/supertab-browser/compare/v1.1.3...v1.2.0) (2023-12-07)

### Bug Fixes

- Bundle with tsup ([d87e730](https://github.com/laterpay/supertab-browser/commit/d87e730da598a21353856845578f497699279c54))

### Features

- bundle with `tsup` ([2813f22](https://github.com/laterpay/supertab-browser/commit/2813f22c8ee440ddd9a4c9524b8dde51c20ea774))

## [1.1.4](https://github.com/laterpay/supertab-browser/compare/v1.1.3...v1.1.4) (2023-12-07)

### Bug Fixes

- Bundle with tsup ([d87e730](https://github.com/laterpay/supertab-browser/commit/d87e730da598a21353856845578f497699279c54))

## [1.2.2](https://github.com/laterpay/supertab-browser/compare/v1.2.1...v1.2.2) (2023-12-05)

### Bug Fixes

- loose typescript peer dependency ([5b54b80](https://github.com/laterpay/supertab-browser/commit/5b54b80a62e81ae9bd799182e54743f63d7acee2))

## [1.2.1](https://github.com/laterpay/supertab-browser/compare/v1.2.0...v1.2.1) (2023-12-05)

### Bug Fixes

- split sbx/prod build folder ([f4a6354](https://github.com/laterpay/supertab-browser/commit/f4a6354b61199e8479908d499d72f5b028d05dba))

# [1.2.0](https://github.com/laterpay/supertab-browser/compare/v1.1.4...v1.2.0) (2023-12-05)

### Features

- bundling with tsup ([cdf127e](https://github.com/laterpay/supertab-browser/commit/cdf127e7bda5e8cc244939fba651b6e5a9a103c9))

## [1.1.4](https://github.com/laterpay/supertab-browser/compare/v1.1.3...v1.1.4) (2023-12-04)

### Bug Fixes

- use target es5 and tsup to compile ([13d703c](https://github.com/laterpay/supertab-browser/commit/13d703cd0fbb688f943e6b6dfe8037baca9de77b))

## [1.1.3](https://github.com/laterpay/supertab-browser/compare/v1.1.2...v1.1.3) (2023-12-04)

### Bug Fixes

- make package restricted and scoped ([a544fd2](https://github.com/laterpay/supertab-browser/commit/a544fd2033552247f3011426e26ec9f7ece8bee0))

## [1.1.2](https://github.com/laterpay/supertab-browser/compare/v1.1.1...v1.1.2) (2023-12-04)

### Bug Fixes

- make package public ([ccc924c](https://github.com/laterpay/supertab-browser/commit/ccc924ce0a413fab56170f77d2facbb06407f4c4))

## [1.1.1](https://github.com/laterpay/supertab-browser/compare/v1.1.0...v1.1.1) (2023-12-04)

### Bug Fixes

- add registry information ([ea8cff6](https://github.com/laterpay/supertab-browser/commit/ea8cff685e24614bc639abe6ce0db7e64e3c1c43))
- enable npm publish ([27631c5](https://github.com/laterpay/supertab-browser/commit/27631c597b68f87bf3c692b716d9e4e490971b32))

# [1.1.0](https://github.com/laterpay/supertab-browser/compare/v1.0.0...v1.1.0) (2023-12-04)

### Bug Fixes

- replace bunx by bun x ([b16c1bb](https://github.com/laterpay/supertab-browser/commit/b16c1bbd82ab96c8a59605b7818f359877afbdff))

### Features

- semantic release ([8dc111a](https://github.com/laterpay/supertab-browser/commit/8dc111a1ba3bd0d686ed6ae8fdfdd1f291cdf273))

# 1.0.0 (2023-12-01)

### Bug Fixes

- minimize user data exposed ([#7](https://github.com/laterpay/supertab-browser/issues/7)) ([f5d7ea9](https://github.com/laterpay/supertab-browser/commit/f5d7ea985d98e08fcf401cfd7abf57df5bebe5d8))
- remove duplicate `localeCode` property ([#10](https://github.com/laterpay/supertab-browser/issues/10)) ([551f19d](https://github.com/laterpay/supertab-browser/commit/551f19d629dfd82744dd6780c40558ae9c9fd1d2))

### Features

- `checkAccess` function ([#12](https://github.com/laterpay/supertab-browser/issues/12)) ([1da8452](https://github.com/laterpay/supertab-browser/commit/1da8452fa9b50143e6b1a6644e89810f9afce422)), closes [#13](https://github.com/laterpay/supertab-browser/issues/13)
- `getUserTab` ([#17](https://github.com/laterpay/supertab-browser/issues/17)) ([4f59230](https://github.com/laterpay/supertab-browser/commit/4f59230cc9c5ce2c829c6690df76b1bba7f0c53e))
- `purchase` ([#20](https://github.com/laterpay/supertab-browser/issues/20)) ([60ea65d](https://github.com/laterpay/supertab-browser/commit/60ea65d5fe3f4be67e865ad475012f131d7519d6))
- add [@authenticated](https://github.com/authenticated) decorator to do auth check ([#6](https://github.com/laterpay/supertab-browser/issues/6)) ([1d3da09](https://github.com/laterpay/supertab-browser/commit/1d3da098baf9f6794506c865ed5ed1557c7244ab))
- add eslint/prettier and make sure all files are formatted ([#19](https://github.com/laterpay/supertab-browser/issues/19)) ([370f4a4](https://github.com/laterpay/supertab-browser/commit/370f4a453418566e5a98d73387a8faf3b7287a8e))
- add unit test with DOM support via happy-dom lib ([#3](https://github.com/laterpay/supertab-browser/issues/3)) ([9955096](https://github.com/laterpay/supertab-browser/commit/99550968cb00d35511158eaaa02beb3930f0d256))
- Bump @laterpay/tapper-sdk to v25.0.0 ([#16](https://github.com/laterpay/supertab-browser/issues/16)) ([a503ca0](https://github.com/laterpay/supertab-browser/commit/a503ca087c194292dc17df0dcbc3f65b5137cacf))
- Bun bundler ([#2](https://github.com/laterpay/supertab-browser/issues/2)) ([5ff792f](https://github.com/laterpay/supertab-browser/commit/5ff792f754b0a875ca9a0ace58a113f9bb46be70))
- get offerings function ([#9](https://github.com/laterpay/supertab-browser/issues/9)) ([74aba46](https://github.com/laterpay/supertab-browser/commit/74aba46b0df45c8828e55232d341d10a4e9d31a1)), closes [#8](https://github.com/laterpay/supertab-browser/issues/8)
- Introduce Supertab Class for Simplified Configuration Management ([#5](https://github.com/laterpay/supertab-browser/issues/5)) ([97b4350](https://github.com/laterpay/supertab-browser/commit/97b43500db04a389b71b4edb4135df48ba6224d0))
- simple auth with demo page ([#4](https://github.com/laterpay/supertab-browser/issues/4)) ([18ee8d5](https://github.com/laterpay/supertab-browser/commit/18ee8d591308654b4eb1d959673ff2f021a03958))
