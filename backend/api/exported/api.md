# Xafari API

> Version 1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/user](#postuser) | add a new user |
| GET | [/user/{user_id}](#getuseruser_id) | get user information |
| DELETE | [/user/{user_id}](#deleteuseruser_id) | delete an user |
| GET | [/user/{user_id}/casas](#getuseruser_idcasas) |  |
| GET | [/user/{user_id}/xecretos](#getuseruser_idxecretos) |  |
| POST | [/user/{user_id}/xecretos](#postuseruser_idxecretos) |  |
| GET | [/user/{user_id}/xelfies](#getuseruser_idxelfies) |  |
| POST | [/user/{user_id}/xelfies](#postuseruser_idxelfies) |  |
| GET | [/user/{user_id}/xperiencias](#getuseruser_idxperiencias) |  |
| POST | [/user/{user_id}/xperiencias](#postuseruser_idxperiencias) |  |
| GET | [/casas](#getcasas) | get all casas |
| POST | [/casa](#postcasa) |  |
| GET | [/casa/{casa_id}](#getcasacasa_id) | get casa information |
| DELETE | [/casa/{casa_id}](#deletecasacasa_id) | delete a casa |
| GET | [/casa/{casa_id}/xecretos](#getcasacasa_idxecretos) | get all xecretos belonging to a casa |
| POST | [/casa/{casa_id}/xecretos](#postcasacasa_idxecretos) | put a xecreto into a casa |
| GET | [/casa/{casa_id}/xelfies](#getcasacasa_idxelfies) | get all xelfies belonging to a casa |
| POST | [/casa/{casa_id}/xelfies](#postcasacasa_idxelfies) | put a xelfie into a casa |
| GET | [/casa/{casa_id}/xperiencias](#getcasacasa_idxperiencias) | get all xperiencias belonging to a casa |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |
| user | [#/components/schemas/user](#componentsschemasuser) |  |
| casa | [#/components/schemas/casa](#componentsschemascasa) |  |
| UserAdded | [#/components/responses/UserAdded](#componentsresponsesuseradded) | User added |
| UserFound | [#/components/responses/UserFound](#componentsresponsesuserfound) | User found |
| UserDeleted | [#/components/responses/UserDeleted](#componentsresponsesuserdeleted) | User deleted |
| UserCasas | [#/components/responses/UserCasas](#componentsresponsesusercasas) | array of casas ids |
| UserXecreto | [#/components/responses/UserXecreto](#componentsresponsesuserxecreto) | xecreto from a user |
| UserXecretos | [#/components/responses/UserXecretos](#componentsresponsesuserxecretos) | array of xecretos ids |
| UserXelfie | [#/components/responses/UserXelfie](#componentsresponsesuserxelfie) | xelfie from a user |
| UserXelfies | [#/components/responses/UserXelfies](#componentsresponsesuserxelfies) | array of xelfies ids |
| UserXperiencia | [#/components/responses/UserXperiencia](#componentsresponsesuserxperiencia) | xperiencia from a user |
| UserXperiencias | [#/components/responses/UserXperiencias](#componentsresponsesuserxperiencias) | array of xperiencias ids |
| UserNotFound | [#/components/responses/UserNotFound](#componentsresponsesusernotfound) | User not found |
| CasaAdded | [#/components/responses/CasaAdded](#componentsresponsescasaadded) | Casa added |
| CasaFound | [#/components/responses/CasaFound](#componentsresponsescasafound) | Casa found |
| CasaDeleted | [#/components/responses/CasaDeleted](#componentsresponsescasadeleted) | Casa deleted |
| CasaNotFound | [#/components/responses/CasaNotFound](#componentsresponsescasanotfound) | User not found |
| Casas | [#/components/responses/Casas](#componentsresponsescasas) | list of casas |
| CasaXecretos | [#/components/responses/CasaXecretos](#componentsresponsescasaxecretos) | array of xecretos ids |
| CasaXecreto | [#/components/responses/CasaXecreto](#componentsresponsescasaxecreto) | xecreto from a casa |
| CasaXecretoNotFound | [#/components/responses/CasaXecretoNotFound](#componentsresponsescasaxecretonotfound) | Casa or Xecreto not found |
| CasaXelfies | [#/components/responses/CasaXelfies](#componentsresponsescasaxelfies) | array of xelfies ids |
| CasaXelfie | [#/components/responses/CasaXelfie](#componentsresponsescasaxelfie) | xelfie from a casa |
| CasaXelfieNotFound | [#/components/responses/CasaXelfieNotFound](#componentsresponsescasaxelfienotfound) | Casa or Xelfie not found |
| CasaXperiencias | [#/components/responses/CasaXperiencias](#componentsresponsescasaxperiencias) | array of xperiencia ids |
| CasaXperiencia | [#/components/responses/CasaXperiencia](#componentsresponsescasaxperiencia) | xperiencia from a casa |
| CasaXperienciaNotFound | [#/components/responses/CasaXperienciaNotFound](#componentsresponsescasaxperiencianotfound) | Casa or Xperiencia not found |
| XecreotNotFound | [#/components/responses/XecreotNotFound](#componentsresponsesxecreotnotfound) | Xecreto not found |
| BadRequestError | [#/components/responses/BadRequestError](#componentsresponsesbadrequesterror) | Bad parameters or not enought params |
| user_id | [#/components/parameters/user_id](#componentsparametersuser_id) | user uuid |
| casa_id | [#/components/parameters/casa_id](#componentsparameterscasa_id) |  |
| xecreto_id | [#/components/parameters/xecreto_id](#componentsparametersxecreto_id) |  |
| xelfie_id | [#/components/parameters/xelfie_id](#componentsparametersxelfie_id) |  |
| xperiencia_id | [#/components/parameters/xperiencia_id](#componentsparametersxperiencia_id) |  |

## Path Details

***

### [POST]/user

- Summary  
add a new user

#### RequestBody

- application/json

```ts
{
  name?: string
  // age is required for age restricted activities
  age?: number
  num_brazalete?: string
  qr_iptv?: string
}
```

#### Responses

- 200 undefined

- 400 undefined

***

### [GET]/user/{user_id}

- Summary  
get user information

#### Responses

- 200 undefined

- 404 undefined

***

### [DELETE]/user/{user_id}

- Summary  
delete an user

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/user/{user_id}/casas

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/user/{user_id}/xecretos

#### Responses

- 200 undefined

- 404 undefined

***

### [POST]/user/{user_id}/xecretos

#### RequestBody

- application/json

```ts
{
  // user id
  id?: string
  // url of image
  url?: string
}
```

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/user/{user_id}/xelfies

#### Responses

- 200 undefined

- 404 undefined

***

### [POST]/user/{user_id}/xelfies

#### RequestBody

- application/json

```ts
{
  // user id
  id?: string
  // url of image
  url?: string
}
```

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/user/{user_id}/xperiencias

#### Responses

- 200 undefined

- 404 undefined

***

### [POST]/user/{user_id}/xperiencias

#### RequestBody

- application/json

```ts
{
  // user id
  id?: string
  // url of image
  url?: string
}
```

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/casas

- Summary  
get all casas

#### Responses

- 200 undefined

***

### [POST]/casa

#### RequestBody

- application/json

```ts
{
  name?: string
  elemento?: string
  animal?: string
}
```

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/casa/{casa_id}

- Summary  
get casa information

#### Responses

- 200 undefined

- 404 undefined

***

### [DELETE]/casa/{casa_id}

- Summary  
delete a casa

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/casa/{casa_id}/xecretos

- Summary  
get all xecretos belonging to a casa

#### Responses

- 200 undefined

- 404 undefined

***

### [POST]/casa/{casa_id}/xecretos

- Summary  
put a xecreto into a casa

#### RequestBody

- application/json

```ts
{
  id?: string
}
```

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/casa/{casa_id}/xelfies

- Summary  
get all xelfies belonging to a casa

#### Responses

- 200 undefined

- 404 undefined

***

### [POST]/casa/{casa_id}/xelfies

- Summary  
put a xelfie into a casa

#### RequestBody

- application/json

```ts
{
  id?: string
}
```

#### Responses

- 200 undefined

- 404 undefined

***

### [GET]/casa/{casa_id}/xperiencias

- Summary  
get all xperiencias belonging to a casa

#### Responses

- 200 undefined

- 404 undefined

## References

### #/components/schemas/user

```ts
{
  name?: string
  // age is required for age restricted activities
  age?: number
  num_brazalete?: string
  qr_iptv?: string
}
```

### #/components/schemas/casa

```ts
{
  name?: string
  elemento?: string
  animal?: string
}
```

### #/components/responses/UserAdded

- application/json

```ts
{
  user: {
    id?: string
    name?: string
    age?: number
    num_brazalete?: number
    qr_iptv?: number
  }
}
```

### #/components/responses/UserFound

- application/json

```ts
{
  user: {
    name?: string
    // age is required for age restricted activities
    age?: number
    num_brazalete?: string
    qr_iptv?: string
  }
}
```

### #/components/responses/UserDeleted

- application/json

```ts
{
  user: {
    id?: string
  }
}
```

### #/components/responses/UserCasas

- application/json

```ts
{
  user: {
    id?: string
    casas?: string[]
  }
}
```

### #/components/responses/UserXecreto

- application/json

```ts
{
  user: {
    id?: string
    xecreto?: string
  }
}
```

### #/components/responses/UserXecretos

- application/json

```ts
{
  user: {
    id?: string
    xecretos?: string[]
  }
}
```

### #/components/responses/UserXelfie

- application/json

```ts
{
  user: {
    id?: string
    xelfie?: string
  }
}
```

### #/components/responses/UserXelfies

- application/json

```ts
{
  user: {
    id?: string
    xelfies?: string[]
  }
}
```

### #/components/responses/UserXperiencia

- application/json

```ts
{
  user: {
    id?: string
    xperiencia?: string
  }
}
```

### #/components/responses/UserXperiencias

- application/json

```ts
{
  user: {
    id?: string
    xperiencias?: string[]
  }
}
```

### #/components/responses/UserNotFound

- application/json

```ts
{
  error?: enum[User not found]
}
```

### #/components/responses/CasaAdded

- application/json

```ts
{
  casa: {
    id?: string
    name?: string
    elemento?: string
    animal?: string
  }
}
```

### #/components/responses/CasaFound

- application/json

```ts
{
  casa: {
    name?: string
    elemento?: string
    animal?: string
  }
}
```

### #/components/responses/CasaDeleted

- application/json

```ts
{
  casa: {
    id?: string
  }
}
```

### #/components/responses/CasaNotFound

- application/json

```ts
{
  error?: enum[Casa not found]
}
```

### #/components/responses/Casas

- application/json

```ts
{
  casas?: string[]
}
```

### #/components/responses/CasaXecretos

- application/json

```ts
{
  casa: {
    id?: string
    xecretos?: string[]
  }
}
```

### #/components/responses/CasaXecreto

- application/json

```ts
{
  casa: {
    id?: string
    xecreto?: string
  }
}
```

### #/components/responses/CasaXecretoNotFound

- application/json

```ts
{
  error?: enum[Casa not found, Xecreto not found]
}
```

### #/components/responses/CasaXelfies

- application/json

```ts
{
  casa: {
    id?: string
    xelfies?: string[]
  }
}
```

### #/components/responses/CasaXelfie

- application/json

```ts
{
  casa: {
    id?: string
    xelfie?: string
  }
}
```

### #/components/responses/CasaXelfieNotFound

- application/json

```ts
{
  error?: enum[Casa not found, Xelfie not found]
}
```

### #/components/responses/CasaXperiencias

- application/json

```ts
{
  casa: {
    id?: string
    xpexiencias?: string[]
  }
}
```

### #/components/responses/CasaXperiencia

- application/json

```ts
{
  casa: {
    id?: string
    xperiencia?: string
  }
}
```

### #/components/responses/CasaXperienciaNotFound

- application/json

```ts
{
  error?: enum[Casa not found, Xperiencia not found]
}
```

### #/components/responses/XecreotNotFound

- application/json

```ts
{
  error?: enum[Xecreto not found]
}
```

### #/components/responses/BadRequestError

- application/josn

```ts
{
  error?: string
}
```

### #/components/parameters/user_id

```ts
user_id: string
```

### #/components/parameters/casa_id

```ts
casa_id: string
```

### #/components/parameters/xecreto_id

```ts
xecreto_id: string
```

### #/components/parameters/xelfie_id

```ts
xecreto_id: string
```

### #/components/parameters/xperiencia_id

```ts
xecreto_id: string
```
