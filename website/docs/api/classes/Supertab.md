---
id: "Supertab"
title: "Class: Supertab"
sidebar_label: "Supertab"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new Supertab**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.clientId` | `string` |
| `options.language?` | `string` |

#### Defined in

[index.ts:47](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L47)

## Properties

### clientId

• `Private` **clientId**: `string`

#### Defined in

[index.ts:43](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L43)

___

### language

• `Private` **language**: `string`

#### Defined in

[index.ts:45](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L45)

___

### tapperConfig

• `Private` **tapperConfig**: `Configuration`

#### Defined in

[index.ts:44](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L44)

## Accessors

### authStatus

• `get` **authStatus**(): `AuthStatus`

#### Returns

`AuthStatus`

#### Defined in

[index.ts:56](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L56)

## Methods

### auth

▸ **auth**(`«destructured»?`): `Promise`<`undefined` \| `Authentication`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `redirectUri` | `string` |
| › `screenHint?` | `string` |
| › `silently` | `boolean` |
| › `state?` | `object` |

#### Returns

`Promise`<`undefined` \| `Authentication`\>

#### Defined in

[index.ts:60](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L60)

___

### getApiVersion

▸ **getApiVersion**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[index.ts:86](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L86)

___

### getCurrentUser

▸ **getCurrentUser**(): `Promise`<{ `id`: `string` = user.id }\>

#### Returns

`Promise`<{ `id`: `string` = user.id }\>

#### Defined in

[index.ts:93](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L93)

___

### getOfferings

▸ **getOfferings**(`«destructured»?`): `Promise`<{ `description`: `undefined` \| ``null`` \| `string` = eachOffering.description; `id`: `undefined` \| `string` = eachOffering.id; `price`: `string`  }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `currency?` | `string` |
| › `language?` | `string` |

#### Returns

`Promise`<{ `description`: `undefined` \| ``null`` \| `string` = eachOffering.description; `id`: `undefined` \| `string` = eachOffering.id; `price`: `string`  }[]\>

#### Defined in

[index.ts:103](https://github.com/laterpay/supertab-browser/blob/1b7b6ad/src/index.ts#L103)
