---
id: "Supertab"
title: "Class: Supertab"
sidebar_label: "Supertab"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Supertab**(`options`): [`Supertab`](Supertab.md)

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `options`           | `Object` |
| `options.clientId`  | `string` |
| `options.language?` | `string` |

#### Returns

[`Supertab`](Supertab.md)

#### Defined in

[index.ts:55](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L55)

## Properties

### \_clientConfig

• `Private` `Optional` **\_clientConfig**: `ClientConfig`

#### Defined in

[index.ts:53](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L53)

---

### clientId

• `Private` **clientId**: `string`

#### Defined in

[index.ts:50](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L50)

---

### language

• `Private` **language**: `string`

#### Defined in

[index.ts:52](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L52)

---

### tapperConfig

• `Private` **tapperConfig**: `Configuration`

#### Defined in

[index.ts:51](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L51)

## Accessors

### authStatus

• `get` **authStatus**(): `AuthStatus`

#### Returns

`AuthStatus`

#### Defined in

[index.ts:64](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L64)

## Methods

### #getClientConfig

▸ **#getClientConfig**(): `Promise`<`ClientConfig`\>

#### Returns

`Promise`<`ClientConfig`\>

#### Defined in

[index.ts:111](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L111)

---

### auth

▸ **auth**(`«destructured»?`): `Promise`<`undefined` \| `Authentication`\>

#### Parameters

| Name             | Type      |
| :--------------- | :-------- |
| `«destructured»` | `Object`  |
| › `redirectUri`  | `string`  |
| › `screenHint?`  | `string`  |
| › `silently`     | `boolean` |
| › `state?`       | `object`  |

#### Returns

`Promise`<`undefined` \| `Authentication`\>

#### Defined in

[index.ts:68](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L68)

---

### checkAccess

▸ **checkAccess**(): `Promise`<{ `validTo`: `undefined` \| `Date` }\>

#### Returns

`Promise`<{ `validTo`: `undefined` \| `Date` }\>

#### Defined in

[index.ts:159](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L159)

---

### getApiVersion

▸ **getApiVersion**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[index.ts:94](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L94)

---

### getCurrentUser

▸ **getCurrentUser**(): `Promise`<{ `id`: `string` = user.id }\>

#### Returns

`Promise`<{ `id`: `string` = user.id }\>

#### Defined in

[index.ts:101](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L101)

---

### getOfferings

▸ **getOfferings**(`«destructured»?`): `Promise`<{ `description`: `undefined` \| `null` \| `string` = eachOffering.description; `id`: `undefined` \| `string` = eachOffering.id; `price`: `string` }[]\>

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `«destructured»` | `Object` |
| › `language?`    | `string` |

#### Returns

`Promise`<{ `description`: `undefined` \| `null` \| `string` = eachOffering.description; `id`: `undefined` \| `string` = eachOffering.id; `price`: `string` }[]\>

#### Defined in

[index.ts:125](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L125)

---

### getUserTab

▸ **getUserTab**(): `Promise`<{ `currency`: `string` = tab.currency; `id`: `string` = tab.id; `limit`: `number` = tab.limit; `purchases`: { `price`: `Price` = purchase.price; `purchaseDate`: `undefined` \| `Date` = purchase.purchaseDate; `summary`: `string` = purchase.summary }[] ; `status`: `TabStatus` = tab.status; `total`: `number` = tab.total }\>

#### Returns

`Promise`<{ `currency`: `string` = tab.currency; `id`: `string` = tab.id; `limit`: `number` = tab.limit; `purchases`: { `price`: `Price` = purchase.price; `purchaseDate`: `undefined` \| `Date` = purchase.purchaseDate; `summary`: `string` = purchase.summary }[] ; `status`: `TabStatus` = tab.status; `total`: `number` = tab.total }\>

#### Defined in

[index.ts:181](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L181)

---

### pay

▸ **pay**(`id`): `Promise`<`void`\>

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:212](https://github.com/laterpay/supertab-browser/blob/151c5b3/src/index.ts#L212)
