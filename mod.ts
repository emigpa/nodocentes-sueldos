export type {
  Adicional,
  AdicionalCapacitacionRatio,
  Adicionales,
  AdicionalGradoRatio,
  AdicionalResult,
  AdicionalTituloRatio,
  AntiguedadPermanenciaRatio,
  Apunsam,
  Calculos,
  CalculosResult,
  CalculosSac,
  Categoria,
  CategoriaSuplemento,
  DatasetAdicionales,
  DatasetSueldosBasicos,
  Formulario,
  HijosRatio,
  HorasExtra,
  HorasExtraRatio,
  JubilacionRatio,
  Meses,
  Permanencia,
  RiesgoFallo,
  RiesgoFalloRatio,
  Sueldo,
  SueldosBasicos,
  SueldosBasicosConDesdeHasta,
  Titulo,
} from './src/types.ts'

export {
  calcularAdicionalCapacitacion,
  calcularAdicionalGrado,
  calcularAdicionalTitulo,
  calcularAntiguedad,
  calcularApunsam,
  calcularHijos,
  calcularHorasExtraCien,
  calcularHorasExtraCincuenta,
  calcularJubilacion,
  calcularLey19032,
  calcularOsunsam,
  calcularPermanencia,
  calcularRiesgoFallo,
  calcularSuplemento,
} from './src/calculos_parciales.ts'

export {
  calcularSac,
  calcularSueldoPorMes,
  calcularSueldos,
  calcularSueldosConPorcentajeAumento,
} from './src/calcular_sueldos.ts'

export { castISOFecha, formatCurrency, formatPercent } from './src/utils.ts'
export { castAdicionales, castSueldosBasicos } from './src/data_parser.ts'
