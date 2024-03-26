# nodocentes-sueldos
> Librería para calcular el sueldo nodocente.

Esta librería permite calcular los suleldos nodocentes, ademas de hacer los calculos parciales de horas extra, adicionales, antiguedad, etc.

## Installation

Node.js:

```sh
npm install nodocentes-sueldos --save
```


## Usage example

Para calcular sueldos hay ejecutar la función calcularSueldos.
Los parámetros son: formulario, sueldosBasicos, Adicionales y un objeto con opciones (meses y año).

Ej:

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

Para mas ejemplos ver tests en /tests

## Release History

* 0.0.1
    * first version

## Contact

Emigpa – emigpa@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/emigpa/nodocentes-sueldos](https://github.com/emigpa/nodocentes-sueldos)

