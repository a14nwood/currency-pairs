import './PriceChart.css';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis
} from 'recharts';
import { DateTime } from 'luxon';

export default function PriceChart(props) {
  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload.length) return null;
    const time = DateTime.fromISO(payload[0].payload.time).toFormat('t DD');
    const price
      = `${props.baseCurrency}: ${payload[0].payload.price.toFixed(8)}`;
    return (
      <div className='PriceChart-tooltip'>
        <div>{time}</div>
        <div>{price}</div>
      </div>
    );
  };

  const renderChart = (
    <ResponsiveContainer>
      <LineChart data={props.priceData}>
        <Line
          animationDuration={0}
          dataKey='price'
          dot={false}
          stroke='hsl(215, 75%, 50%)'
          strokeWidth={2}
          type='monotone'
        />
        <Tooltip animationDuration={50} content={renderTooltip} />
        <YAxis domain={['dataMin', 'dataMax']} hide />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="PriceChart">
      {props.priceData.length ? renderChart : 'Loading...'}
    </div>
  );
}
