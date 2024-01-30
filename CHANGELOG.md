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
