import { Adicionales, DatasetAdicionales, DatasetSueldosBasicos, SueldosBasicos } from './types.ts'
import { DateTime, Interval } from '../deps.ts'
import { castFecha, sueldo2Number } from './utils.ts'

/**
 * Casts the given `sueldo` object of type `DatasetSueldosBasicos` (all string type) to `SueldosBasicos` type.
 *
 * @param sueldo - The `DatasetSueldosBasicos` object to be casted.
 * @returns The `SueldosBasicos` object after casting.
 */
export function castSueldosBasicos(sueldo: DatasetSueldosBasicos): SueldosBasicos {
  return ({
    FECHA: castFecha(sueldo.FECHA),
    'CATEGORIA 1': sueldo2Number(sueldo['CATEGORIA 1']),
    'CATEGORIA 2': sueldo2Number(sueldo['CATEGORIA 2']),
    'CATEGORIA 3': sueldo2Number(sueldo['CATEGORIA 3']),
    'CATEGORIA 4': sueldo2Number(sueldo['CATEGORIA 4']),
    'CATEGORIA 5': sueldo2Number(sueldo['CATEGORIA 5']),
    'CATEGORIA 6': sueldo2Number(sueldo['CATEGORIA 6']),
    'CATEGORIA 7': sueldo2Number(sueldo['CATEGORIA 7']),
  })
}

/**
 * Casts the given dataset of Adicionales (all string type) into the Adicionales type.
 * @param adicionales The dataset of additional information.
 * @returns The casted Adicionales object.
 */
export function castAdicionales(adicionales: DatasetAdicionales): Adicionales {
  return ({
    DESDE: castFecha(adicionales.DESDE),
    HASTA: castFecha(adicionales.HASTA),
    'CATEGORIA 1': sueldo2Number(adicionales['CATEGORIA 1']),
    'CATEGORIA 2': sueldo2Number(adicionales['CATEGORIA 2']),
    'CATEGORIA 3': sueldo2Number(adicionales['CATEGORIA 3']),
    'CATEGORIA 4': sueldo2Number(adicionales['CATEGORIA 4']),
    'CATEGORIA 5': sueldo2Number(adicionales['CATEGORIA 5']),
    'CATEGORIA 6': sueldo2Number(adicionales['CATEGORIA 6']),
    'CATEGORIA 7': sueldo2Number(adicionales['CATEGORIA 7']),
    CONCEPTO: adicionales.CONCEPTO,
    REMUNERATIVO: adicionales.REMUNERATIVO,
  })
}

/**
 * Calculates the timeline of basic salaries.
 *
 * @param sueldos - The array of basic salaries.
 * @returns The array of basic salaries with DESDE and HASTA dates.
 */
export function sueldosBasicosOnTimeline(sueldos: SueldosBasicos[]): SueldosBasicos[] {
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
  sueldos: SueldosBasicos[],
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
