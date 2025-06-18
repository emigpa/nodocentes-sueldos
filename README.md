# nodocentes-sueldos
> Librería para calcular el sueldo nodocente.

Esta librería permite calcular los suleldos nodocentes, ademas de hacer los calculos parciales de horas extra, adicionales, antiguedad, etc.

## Installation

NPM

```sh
npm i nodocentes-sueldos
```

JSR

```sh
npx jsr add @emigpa/nodocentes-sueldos
```

## Usage example

Para calcular sueldos hay ejecutar la función calcularSueldos.
Los parámetros son: formulario, sueldosBasicos, Adicionales y un objeto con opciones (meses y año).

Example:

```js
calcularSueldos(
  {
    categoria: 'CATEGORIA 3',
    antiguedad: 0,
    titulo: 'TGU',
    permanencia: '0 a 2 años',
    suplementoCategoria: 'CATEGORIA 2',
    apunsam: 'NO',
    horasExtraCincuenta: 0,
    horasExtraCien: 0,
    riesgofallo: 'NO',
    'añoCalcular': '2024',
    hijos: 0,
  },
  [{
    FECHA: '1/2/2024',
    'CATEGORIA 1': 941390.44,
    'CATEGORIA 2': 784493.47,
    'CATEGORIA 3': 652706.41,
    'CATEGORIA 4': 542877.05,
    'CATEGORIA 5': 451868.38,
    'CATEGORIA 6': 376551.16,
    'CATEGORIA 7': 313795.81,
  },
  {
    FECHA: '1/3/2024',
    'CATEGORIA 1': 1054358,
    'CATEGORIA 2': 878633,
    'CATEGORIA 3': 731032,
    'CATEGORIA 4': 608023,
    'CATEGORIA 5': 506093,
    'CATEGORIA 6': 421738,
    'CATEGORIA 7': 351452,
  }],
  [{
    DESDE: '1/2/2024',
    HASTA: '1/3/2024',
    CONCEPTO: 'SUMA FIJA',
    REMUNERATIVO: 'NO'
    'CATEGORIA 1': 0,
    'CATEGORIA 2': 0,
    'CATEGORIA 3': 0,
    'CATEGORIA 4': 0,
    'CATEGORIA 5': 0,
    'CATEGORIA 6': 200,
    'CATEGORIA 7': 100,
  }],
  {
    meses: ['2', '3'],
    año: '2024'
  }
  )
```
Result:
```js
[
  {
    mes: "2024-02-01",
    adicionales: [ { monto: "200", concepto: "suma fija", remunerativo: "SI" } ],
    montoSueldoBasico: "652706.41",
    montoSueldoSuplemento: "158144.47",
    montoPermanencia: "0",
    montoAdicionalGrado: "54914.54",
    montoAdicionalCapacitacion: "31379.74",
    montoAdicionalTitulo: "130541.28",
    montoAntiguedad: "0",
    montoRiesgoFallo: "0",
    montoHorasExtraCincuenta: "0",
    montoHorasExtraCien: "0",
    montoJubilacion: "113067.51",
    montoLey19032: "30836.59",
    montoOsunsam: "30836.59",
    montoApunsam: "0",
    montoHijos: "0",
    montoTotalDescuentos: "174740.69",
    montoSueldoNeto: "853145.75",
    montoSueldoBruto: "1027886.44",
    porcentajeAumento: "0"
  },
  {
    mes: "2024-03-01",
    adicionales: [ { monto: "200", concepto: "suma fija", remunerativo: "SI" } ],
    montoSueldoBasico: "731032",
    montoSueldoSuplemento: "177121.2",
    montoPermanencia: "0",
    montoAdicionalGrado: "61504.31",
    montoAdicionalCapacitacion: "35145.32",
    montoAdicionalTitulo: "146206.4",
    montoAntiguedad: "0",
    montoRiesgoFallo: "0",
    montoHorasExtraCincuenta: "0",
    montoHorasExtraCien: "0",
    montoJubilacion: "126633.02",
    montoLey19032: "34536.28",
    montoOsunsam: "34536.28",
    montoApunsam: "0",
    montoHijos: "0",
    montoTotalDescuentos: "195705.58",
    montoSueldoNeto: "955503.65",
    montoSueldoBruto: "1151209.23",
    porcentajeAumento: "12",
    porcentajeAumentoBasico: "12"
  }
]

```

Para mas ejemplos ver tests en /tests

## Release History
* 0.1.11
  * Modified SAC type.
* 0.1.10
  * Exports and fixes.
* 0.1.9
  * Added calc SAC.
* 0.1.8
  * Fix adicionalesDetalle calc against categoria revista.
* 0.1.7
  * Fix adicionales calc against categoria revista.
* 0.1.6
  * Fix adicionales wrong cast.
* 0.1.5
  * Export types and helper functions.
* 0.1.4
  * Calculate porcentaje aumento sueldo básico.
* 0.1.3
  * If mes is Enero, don't add adicional por hijo.
* 0.1.2
  * Added ars option to API
* 0.1.1
  * Return results object props as string, date as UTC.
  * Fix: script typos.
* 0.1.0
  * first version

## Build and publish

### NPM
```bash
# 1. run script
deno run -A scripts/build_npm.ts ${package-version}

# 2. go to output directory and publish
cd npm
npm publish
```

### JSR
```bash
# 1. modify package version in file deno.json

# 2. run script
deno publish
```
## Contact

Emigpa – emigpa@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/emigpa/nodocentes-sueldos](https://github.com/emigpa/nodocentes-sueldos)

