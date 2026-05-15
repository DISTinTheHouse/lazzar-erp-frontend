import { faker } from '@faker-js/faker';
import {
  PRODUCTION_ORDER_STEPS,
  PRODUCTION_ORDER_STATUS_LABELS,
  type ProductionOrder,
  type ProductionOrderStatus,
  type ProductionOrderPriority,
  type ProductionOrderEventRecord,
} from '../interfaces/production-order.interface';

// Semilla fija para datos deterministas
faker.seed(4001);

// Silenciar la advertencia de referencia no utilizada en prod
void PRODUCTION_ORDER_STATUS_LABELS;

// ── Catálogos ────────────────────────────────────────────────────────────────

const NOMBRES_PRODUCTO = [
  'Playera Básica Algodón',
  'Polo Corporativo Piqué',
  'Camiseta Técnica Deportiva',
  'Chamarra Impermeable',
  'Pantalón de Cargo',
  'Shorts Deportivos',
  'Sudadera con Capucha',
  'Chaleco Reflectante',
  'Uniforme Industrial Completo',
  'Bata de Laboratorio',
  'Pants Jogger Premium',
  'Camisa Manga Larga Formal',
  'Overol de Trabajo',
  'Capa de Lluvia',
  'Camisola Bordada',
  'Blusa Estampada Sublimación',
  'Conjunto Deportivo',
  'Traje de Baño Competencia',
  'Jersey de Futbol',
  'Cuello Alto Térmico',
];

const CLAVES_PRODUCTO = [
  'CAM-001', 'CAM-002', 'CAM-003', 'CAM-004',
  'POLO-001', 'POLO-002', 'POLO-003',
  'CHAP-001', 'CHAP-002',
  'PANT-001', 'PANT-002', 'PANT-003',
  'OVER-001', 'OVER-002',
  'CHALECO-001', 'CHALECO-002',
  'SUDAD-001', 'SUDAD-002',
  'SHORT-001', 'JERSEY-001',
];

const AREAS = [
  'Confección',
  'Bordado',
  'Estampado',
  'Corte y Confección',
  'Sublimación',
  'Línea Industrial',
];

const UNIDADES_MEDIDA = ['PZA', 'PZA', 'PZA', 'KG', 'MT'];

const RESPONSABLES_PRODUCCION  = ['Mario Ortega', 'Patricia Luna', 'Roberto Sosa', 'Diana Reyes'];
const RESPONSABLES_ALMACEN     = ['Luis Herrera', 'Sandra Pérez', 'Tomás Vargas', 'Nora Castillo'];
const RESPONSABLES_COMPRAS     = ['Erika Morales', 'Javier Ríos', 'Carmen Salinas'];

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Devuelve el número de paso canónico a partir del estatus.
 * - comprando_materiales y material_faltante se posicionan en el paso 2.
 * - cancelada recibe un paso aleatorio entre 1 y 4.
 */
function getPasoActual(estatus: ProductionOrderStatus): number {
  if (estatus === 'comprando_materiales' || estatus === 'material_faltante') return 2;
  if (estatus === 'cancelada') return faker.number.int({ min: 1, max: 4 });
  return PRODUCTION_ORDER_STEPS.indexOf(estatus as (typeof PRODUCTION_ORDER_STEPS)[number]) + 1;
}

/**
 * Genera el historial de eventos desde el paso 1 hasta el paso canónico actual.
 * Para órdenes con faltantes se inserta un evento extra de comprando_materiales
 * entre el paso 2 y el paso 3.
 */
function generarHistorial(
  pasoActual: number,
  estatus: ProductionOrderStatus,
  tuvoFaltantes: boolean,
  responsables: { produccion: string; almacen: string; compras: string },
  fechaBase: Date
): ProductionOrderEventRecord[] {
  const historial: ProductionOrderEventRecord[] = [];
  let fechaEvento = new Date(fechaBase);

  // Mapa de responsable por número de paso canónico
  const responsablePorPaso: Record<number, string> = {
    1: responsables.produccion,
    2: responsables.almacen,
    3: responsables.produccion,
    4: responsables.produccion,
    5: responsables.produccion,
    6: responsables.almacen,
  };

  for (let paso = 1; paso <= pasoActual; paso++) {
    // Avance entre 1 y 4 días hábiles por evento
    fechaEvento = new Date(fechaEvento.getTime() + faker.number.int({ min: 1, max: 4 }) * 86_400_000);

    let estatusPaso: ProductionOrderStatus;
    if (paso === pasoActual && (estatus === 'cancelada' || estatus === 'material_faltante')) {
      estatusPaso = estatus;
    } else {
      estatusPaso = PRODUCTION_ORDER_STEPS[paso - 1];
    }

    historial.push({
      paso,
      estatus: estatusPaso,
      fecha: fechaEvento.toISOString(),
      responsable: responsablePorPaso[paso] ?? responsables.produccion,
      notas: faker.helpers.arrayElement([
        'Completado sin observaciones.',
        'Se realizó verificación antes de continuar.',
        'Proceso completado en el tiempo estimado.',
        'Coordinado con el área responsable para continuar.',
        'Se detectaron puntos de mejora; documentados para siguiente ciclo.',
        faker.lorem.sentence(6),
      ]),
    });

    // Insertar evento extra de comprando_materiales entre paso 2 y 3 si aplica
    if (paso === 2 && tuvoFaltantes && pasoActual >= 3) {
      fechaEvento = new Date(fechaEvento.getTime() + faker.number.int({ min: 2, max: 6 }) * 86_400_000);
      historial.push({
        paso: 2.5,
        estatus: 'comprando_materiales',
        fecha: fechaEvento.toISOString(),
        responsable: responsables.compras,
        notas: faker.helpers.arrayElement([
          'Orden de compra emitida al proveedor.',
          'Materiales adquiridos y recibidos en almacén.',
          'Compra urgente autorizada por jefatura.',
          'Proveedor local entregó en tiempo récord.',
        ]),
      });
    }

    // Insertar evento de comprando cuando el estatus actual ES comprando_materiales
    if (paso === 2 && estatus === 'comprando_materiales') {
      fechaEvento = new Date(fechaEvento.getTime() + faker.number.int({ min: 1, max: 3 }) * 86_400_000);
      historial.push({
        paso: 2.5,
        estatus: 'comprando_materiales',
        fecha: fechaEvento.toISOString(),
        responsable: responsables.compras,
        notas: faker.helpers.arrayElement([
          'Orden de compra emitida; en espera de entrega del proveedor.',
          'Material en tránsito, ETA confirmada.',
          'Compra en proceso de autorización.',
        ]),
      });
      break; // el flujo se detiene aquí
    }
  }

  return historial;
}

// ── Pool de estatus — 35 registros ───────────────────────────────────────────
// Distribución: 3+4+4+5+5+6+3+3+2 = 35

const POOL_ESTATUS: Array<{ estatus: ProductionOrderStatus; tuvoFaltantes: boolean }> = [
  ...Array(3).fill(null).map(() => ({ estatus: 'creada'                as ProductionOrderStatus, tuvoFaltantes: false })),
  ...Array(4).fill(null).map(() => ({ estatus: 'verificando_materiales'as ProductionOrderStatus, tuvoFaltantes: false })),
  ...Array(4).fill(null).map(() => ({ estatus: 'en_fabricacion'        as ProductionOrderStatus, tuvoFaltantes: false })),
  ...Array(3).fill(null).map(() => ({ estatus: 'en_fabricacion'        as ProductionOrderStatus, tuvoFaltantes: true  })),
  ...Array(4).fill(null).map(() => ({ estatus: 'registrando_avance'    as ProductionOrderStatus, tuvoFaltantes: false })),
  ...Array(2).fill(null).map(() => ({ estatus: 'registrando_avance'    as ProductionOrderStatus, tuvoFaltantes: true  })),
  ...Array(4).fill(null).map(() => ({ estatus: 'cierre_solicitado'     as ProductionOrderStatus, tuvoFaltantes: false })),
  ...Array(3).fill(null).map(() => ({ estatus: 'cerrada'               as ProductionOrderStatus, tuvoFaltantes: false })),
  ...Array(2).fill(null).map(() => ({ estatus: 'cerrada'               as ProductionOrderStatus, tuvoFaltantes: true  })),
  ...Array(3).fill(null).map(() => ({ estatus: 'material_faltante'     as ProductionOrderStatus, tuvoFaltantes: true  })),
  ...Array(2).fill(null).map(() => ({ estatus: 'comprando_materiales'  as ProductionOrderStatus, tuvoFaltantes: true  })),
  ...Array(3).fill(null).map(() => ({ estatus: 'cancelada'             as ProductionOrderStatus, tuvoFaltantes: false })),
];

// ── Generación del catálogo mock ─────────────────────────────────────────────

export const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = Array.from(
  { length: 35 },
  (_, i) => {
    const { estatus, tuvoFaltantes } = POOL_ESTATUS[i];
    const pasoActual = getPasoActual(estatus);

    // Fechas distribuidas en los últimos 5 meses
    const fechaCreacion = new Date(
      Date.now() - faker.number.int({ min: 5, max: 150 }) * 86_400_000
    );

    const diasEstimados = faker.number.int({ min: 15, max: 45 });
    const fechaEstimada =
      estatus === 'cancelada'
        ? null
        : new Date(fechaCreacion.getTime() + diasEstimados * 86_400_000).toISOString();

    const responsable_produccion = faker.helpers.arrayElement(RESPONSABLES_PRODUCCION);
    const responsable_almacen    = faker.helpers.arrayElement(RESPONSABLES_ALMACEN);
    const responsable_compras    = faker.helpers.arrayElement(RESPONSABLES_COMPRAS);

    // Responsable activo según el paso actual
    const responsableActivoPorPaso: Record<number, string> = {
      1: responsable_produccion,
      2: responsable_almacen,
      3: responsable_produccion,
      4: responsable_produccion,
      5: responsable_produccion,
      6: responsable_almacen,
    };
    const responsableActivoEspecial: Partial<Record<ProductionOrderStatus, string>> = {
      comprando_materiales: responsable_compras,
      material_faltante:    responsable_almacen,
      cancelada:            responsable_produccion,
    };

    const responsable_actual =
      responsableActivoEspecial[estatus] ??
      responsableActivoPorPaso[pasoActual] ??
      responsable_produccion;

    const historial = generarHistorial(
      pasoActual,
      estatus,
      tuvoFaltantes,
      { produccion: responsable_produccion, almacen: responsable_almacen, compras: responsable_compras },
      fechaCreacion
    );

    const folioSeq = String(i + 1).padStart(3, '0');

    const prioridadOptions: ProductionOrderPriority[] = ['alta', 'media', 'media', 'baja'];

    return {
      id:                     faker.string.uuid(),
      folio:                  `OP-2025-${folioSeq}`,
      fecha_creacion:         fechaCreacion.toISOString(),
      fecha_estimada_entrega: fechaEstimada,
      nombre_producto:        faker.helpers.arrayElement(NOMBRES_PRODUCTO),
      clave_producto:         faker.helpers.arrayElement(CLAVES_PRODUCTO),
      descripcion:            faker.commerce.productDescription(),
      area:                   faker.helpers.arrayElement(AREAS),
      cantidad_total:         faker.number.int({ min: 50, max: 3_000 }),
      unidad_medida:          faker.helpers.arrayElement(UNIDADES_MEDIDA),
      prioridad:              faker.helpers.arrayElement(prioridadOptions),
      estatus,
      paso_actual:            pasoActual,
      tuvo_faltantes:         tuvoFaltantes,
      responsable_produccion,
      responsable_almacen,
      responsable_compras,
      responsable_actual,
      observaciones: faker.helpers.arrayElement([
        '',
        '',
        'Revisar especificaciones de tela con el proveedor antes de corte.',
        'Pendiente confirmación de color con el cliente.',
        'Urgente: entrega comprometida para feria de temporada.',
        'Requiere aprobación de muestra antes de producción masiva.',
        faker.lorem.sentence(7),
      ]),
      historial,
    } satisfies ProductionOrder;
  }
);
