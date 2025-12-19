import type {
  Adicional,
  Adicionales,
  AdicionalResult,
  Bonificable,
  Calculos,
  CalculosResult,
  DatasetAdicionales,
  DatasetSueldosBasicos,
  Remunerativo,
  SueldosBasicos,
  SueldosBasicosConDesdeHasta,
} from './types.ts'
import { DateTime, Interval } from 'luxon'
import { castFecha, sueldo2Number, sueldoARS2Number } from './utils.ts'

/**
 * Casts the sueldos basicos dataset into a standardized format.
 *
 * @param sueldo - The dataset of sueldos basicos.
 * @param ars - Optional parameter indicating whether to convert the sueldo values to ARS currency.
 * @returns The sueldos basicos dataset in the standardized format.
 */
export function castSueldosBasicos(sueldo: DatasetSueldosBasicos, ars = false): SueldosBasicos {
  const castSueldo2Number = ars ? sueldoARS2Number : sueldo2Number
  return ({
    FECHA: castFecha(sueldo.FECHA),
    'CATEGORIA 1': castSueldo2Number(sueldo['CATEGORIA 1']),
    'CATEGORIA 2': castSueldo2Number(sueldo['CATEGORIA 2']),
    'CATEGORIA 3': castSueldo2Number(sueldo['CATEGORIA 3']),
    'CATEGORIA 4': castSueldo2Number(sueldo['CATEGORIA 4']),
    'CATEGORIA 5': castSueldo2Number(sueldo['CATEGORIA 5']),
    'CATEGORIA 6': castSueldo2Number(sueldo['CATEGORIA 6']),
    'CATEGORIA 7': castSueldo2Number(sueldo['CATEGORIA 7']),
  })
}

/**
 * Casts the provided dataset of adicionales to the Adicionales type.
 * @param adicionales - The dataset of adicionales to be casted.
 * @param ars - Optional parameter indicating whether to use ARS conversion for sueldo values. Default is false.
 * @returns The casted Adicionales object.
 */
export function castAdicionales(adicionales: DatasetAdicionales, ars = false): Adicionales {
  const castSueldo2Number = ars ? sueldoARS2Number : sueldo2Number
  return ({
    DESDE: castFecha(adicionales.DESDE),
    HASTA: castFecha(adicionales.HASTA),
    CONCEPTO: adicionales.CONCEPTO,
    REMUNERATIVO: adicionales.REMUNERATIVO as Remunerativo,
    BONIFICABLES: adicionales.BONIFICABLES as Bonificable,
    'CATEGORIA 1': castSueldo2Number(adicionales['CATEGORIA 1']),
    'CATEGORIA 2': castSueldo2Number(adicionales['CATEGORIA 2']),
    'CATEGORIA 3': castSueldo2Number(adicionales['CATEGORIA 3']),
    'CATEGORIA 4': castSueldo2Number(adicionales['CATEGORIA 4']),
    'CATEGORIA 5': castSueldo2Number(adicionales['CATEGORIA 5']),
    'CATEGORIA 6': castSueldo2Number(adicionales['CATEGORIA 6']),
    'CATEGORIA 7': castSueldo2Number(adicionales['CATEGORIA 7']),
  })
}

/**
 * Calculates the timeline of basic salaries.
 *
 * @param sueldos - The array of basic salaries.
 * @returns The array of basic salaries with DESDE and HASTA dates.
 */
export function sueldosBasicosOnTimeline(sueldos: SueldosBasicos[]): SueldosBasicosConDesdeHasta[] {
  return sueldos
    // ordenarlos por fecha descendente
    .sort((a, b) => a.FECHA > b.FECHA ? -1 : a.FECHA < b.FECHA ? 1 : 0)
    .map((a, i, arr) =>
      i === 0
        // si es el primer elemento (el que tiene la fecha mayor) ponerle fecha hasta fin del año.
        ? {
          ...a,
          DESDE: a.FECHA,
          HASTA: DateTime.fromObject({ year: a.FECHA.year, month: 12 }).endOf(
            'month',
          ).setLocale('es-AR'),
        }
        // al resto de los elementos ponerle fecha un dia antes del anterior.
        : {
          ...a,
          DESDE: a.FECHA,
          HASTA: arr[i - 1].FECHA.minus({ days: 1 }).endOf('day'),
        }
    )
    // ordenarlos por fecha ascendente
    .sort((a, b) => a.FECHA < b.FECHA ? -1 : a.FECHA > b.FECHA ? 1 : 0)
}

/**
 * Finds the SueldosBasicos within a given date range.
 * @param sueldos - The array of SueldosBasicos to search.
 * @param desde - The start date of the range.
 * @param hasta - The end date of the range.
 * @returns The SueldosBasicos that are within the specified date range.
 */
export function findSueldosBasicosPorFecha(
  sueldos: SueldosBasicosConDesdeHasta[],
  desde: DateTime,
  hasta: DateTime,
): SueldosBasicos {
  return sueldos
    // filtar los sueldos que estan vigentes mes a mes.
    .find((s) => {
      const mes = Interval.fromDateTimes(desde, hasta)
      const vigenciaAdicionales = Interval.fromDateTimes(s.DESDE, s.HASTA)
      // los adicionales que estan vigentes en cada mes.
      return mes.overlaps(vigenciaAdicionales)
    }) || {
    'FECHA': desde,
    'DESDE': desde,
    'HASTA': hasta,
    'CATEGORIA 1': 0,
    'CATEGORIA 2': 0,
    'CATEGORIA 3': 0,
    'CATEGORIA 4': 0,
    'CATEGORIA 5': 0,
    'CATEGORIA 6': 0,
    'CATEGORIA 7': 0,
  }
}

/**
 * Filters the "adicionales" array based on the specified date range.
 * @param adicionales - The array of "Adicionales" objects to filter.
 * @param desde - The start date of the range.
 * @param hasta - The end date of the range.
 * @returns The filtered array of "Adicionales" objects.
 */
export function filterAdicionalesPorFecha(adicionales: Adicionales[], desde: DateTime, hasta: DateTime): Adicionales[] {
  return adicionales
    .filter((a) => {
      const mes = Interval.fromDateTimes(desde, hasta)
      const vigenciaAdicionales = Interval.fromDateTimes(a.DESDE, a.HASTA)
      // los adicionales que estan vigentes en cada mes.
      return mes.overlaps(vigenciaAdicionales)
    })
}

export function parseResults(calculos: Calculos[]): CalculosResult[] {
  return calculos
    .map((c: Calculos): CalculosResult => ({
      mes: c.mes.toISODate() || '',
      adicionales: c.adicionales.map((a: Adicional): AdicionalResult => ({
        monto: a.monto.toString(),
        concepto: a.concepto.toString(),
        remunerativo: a.remunerativo ? 'SI' : 'NO',
      })),
      montoSueldoBasico: c.montoSueldoBasico.toString(),
      montoSueldoSuplemento: c.montoSueldoSuplemento.toString(),
      montoPermanencia: c.montoPermanencia.toString(),
      montoAdicionalGrado: c.montoAdicionalGrado.toString(),
      montoAdicionalCapacitacion: c.montoAdicionalCapacitacion.toString(),
      montoAdicionalTitulo: c.montoAdicionalTitulo.toString(),
      montoAntiguedad: c.montoAntiguedad.toString(),
      montoRiesgoFallo: c.montoRiesgoFallo.toString(),
      montoHorasExtraCincuenta: c.montoHorasExtraCincuenta.toString(),
      montoHorasExtraCien: c.montoHorasExtraCien.toString(),
      montoJubilacion: c.montoJubilacion.toString(),
      montoLey19032: c.montoLey19032.toString(),
      montoOsunsam: c.montoOsunsam.toString(),
      montoApunsam: c.montoApunsam.toString(),
      montoHijos: c.montoHijos.toString(),
      montoTotalDescuentos: c.montoTotalDescuentos.toString(),
      montoSueldoNeto: c.montoSueldoNeto.toString(),
      montoSueldoBruto: c.montoSueldoBruto.toString(),
      porcentajeAumento: c.porcentajeAumento?.toString() || '0',
      porcentajeAumentoBasico: c.porcentajeAumentoBasico?.toString() || '0',
    }))
}
