import './../../loading.css';
import './PriceViewer.css';
import { useEffect, useState } from 'react';
import PriceChart from '../PriceChart/PriceChart';

export default function PriceViewer() {
  const [baseCurrency, setBaseCurrency] = useState('USDC');
  const [priceData, setPriceData] = useState([]);
  const [quoteCurrency, setQuoteCurrency] = useState('WETH');
  const [timespan, setTimespan] = useState('1D');

  useEffect(() => {
    const controller = new AbortController();
    const url = `/pair/:${baseCurrency}-${quoteCurrency}?timespan=${timespan}`;
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        data.length ? setPriceData(data) : setPriceData(null);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error(err);
      });

    return () => controller.abort();
  }, [baseCurrency, quoteCurrency, timespan]);

  return (
    <div className='PriceViewer'>
      <div className='PriceViewer-currencyDisplay'>
        Price of
        <input
          className='PriceViewer-currencyInput'
          value={quoteCurrency}
          onChange={evt => {
            setPriceData([]);
            setQuoteCurrency(evt.currentTarget.value.toUpperCase());
          }}
        />
        vs.
        <input
          className='PriceViewer-currencyInput'
          value={baseCurrency}
          onChange={evt => {
            setPriceData([]);
            setBaseCurrency(evt.currentTarget.value.toUpperCase());
          }}
        />
      </div>
      <div className='PriceViewer-priceDisplay'>
        {priceData && priceData.length
          ? `1 ${quoteCurrency}
          = ${priceData[priceData.length - 1].price.toFixed(8)} ${baseCurrency}`
          : 'Loading...'}
      </div>
      <div className='PriceViewer-timespanSelection'>
        {['1D', '7D', '30D', '90D', '365D'].map(timespanBtn => (
          <button
            className={timespanBtn === timespan
              ? 'PriceViewer-timespanButton PriceViewer-timespanButton-active'
              : 'PriceViewer-timespanButton'}
            key={timespanBtn}
            onClick={() => { setPriceData([]); setTimespan(timespanBtn); }}
          >
            {timespanBtn}
          </button>
        ))}
      </div>
      {priceData
        ? priceData.length
          ? <PriceChart priceData={priceData} baseCurrency={baseCurrency} />
          : <div className="PriceViewer-loading lds-default">
            <div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        : <div className='PriceViewer-noData'>
          No data available
        </div>}
    </div>
  );
}
