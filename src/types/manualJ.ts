/**
 * Represents climate design conditions for the building location
 */
export interface ClimateData {
  /** Location zip code or identifier */
  locationId: string;
  /** Summer outdoor design temperature (°F) */
  summerDesignTemp: number;
  /** Winter outdoor design temperature (°F) */
  winterDesignTemp: number;
  /** Summer design humidity ratio (grains/lb) */
  summerHumidityRatio: number;
  /** Site altitude above sea level (ft) */
  altitude: number;
}

/**
 * Represents the possible directions for windows and walls in a room
 */
export type Direction = 'N' | 'S' | 'E' | 'W';

/**
 * Represents window properties including thermal and solar characteristics
 */
export interface Window {
  /** Cardinal direction the window faces */
  direction: Direction;
  /** Area of the window in square feet */
  area: number;
  /** Window U-factor for thermal transmission */
  uFactor: number;
  /** Solar Heat Gain Coefficient */
  shgc: number;
  /** Window shading coefficient (0-1) */
  shadingCoefficient: number;
}

/**
 * Represents building envelope infiltration characteristics
 */
export interface Infiltration {
  /** Air changes per hour at 50 Pascal pressure (from blower door test) */
  ach50?: number;
  /** Estimated natural air changes per hour */
  naturalAch: number;
  /** Building tightness classification */
  buildingTightness: 'tight' | 'average' | 'loose';
}

/**
 * Represents internal load characteristics of a room
 */
export interface InternalLoads {
  /** Number of occupants typically in the room */
  occupants: number;
  /** Heat gain from appliances (BTU/hr) */
  applianceLoad: number;
  /** Heat gain from lighting (BTU/hr) */
  lightingLoad: number;
}

/**
 * Represents a room in the building with its properties
 */
export interface Room {
  /** Name or identifier of the room */
  name: string;
  /** Room dimensions as [length, width] in feet */
  dimensions: [number, number];
  /** Height of the room ceiling in feet */
  ceilingHeight: number;
  /** Insulation R-value of the walls */
  wallRValue: number;
  /** Insulation R-value of the ceiling/roof */
  ceilingRValue: number;
  /** Insulation R-value of the floor */
  floorRValue: number;
  /** Array of windows in the room */
  windows: Window[];
  /** Internal heat gain sources */
  internalLoads: InternalLoads;
  /** Ventilation requirements in CFM */
  ventilationCfm: number;
}

/**
 * Represents the complete results of a Manual J calculation
 * Used to store and process heating and cooling load calculations
 * along with detailed room information
 */
export interface ManualJResult {
  /** Climate data used for the calculation */
  climateData: ClimateData;
  /** Building infiltration characteristics */
  infiltration: Infiltration;
  /** Total heating load in BTUs per hour */
  heatingLoad: number;
  /** Total sensible cooling load in BTUs per hour */
  sensibleCoolingLoad: number;
  /** Total latent cooling load in BTUs per hour */
  latentCoolingLoad: number;
  /** Detailed information about each room in the calculation */
  rooms: Room[];
  /** Timestamp when calculation was performed */
  calculatedAt: Date;
  /** Version of Manual J calculation method used */
  version: string;
}
