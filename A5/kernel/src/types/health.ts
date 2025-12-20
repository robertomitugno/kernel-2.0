export interface HealthParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  trend: 'up' | 'down' | 'stable';
}

export interface HealthAlert {
  id: string;
  parameterId: string;
  parameterName: string;
  severity: 'warning' | 'danger';
  message: string;
  recommendation: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface HealthMetricHistory {
  parameterId: string;
  data: ChartDataPoint[];
}
