import React from 'react';
import { WeatherWidget, WeatherWidgetProps } from './WeatherWidget';

export interface WeatherCardProps extends WeatherWidgetProps {
  onShowNotification?: (msg: string) => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  return <WeatherWidget {...props} />;
};

export default WeatherCard;
