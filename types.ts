
export type EventType = 'ORDER' | 'SEARCH' | 'VIEW';

export interface FoodEvent {
  id: string;
  itemId: string;
  itemName: string;
  type: EventType;
  timestamp: number;
}

export interface VelocityStats {
  itemId: string;
  itemName: string;
  category: string;
  velocity: number; // Percentage change per window
  currentDemand: number;
  prevDemand: number;
  orders: number;
  searches: number;
  views: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface DemandSnapshot {
  timestamp: number;
  stats: VelocityStats[];
  totalEvents: number;
}
