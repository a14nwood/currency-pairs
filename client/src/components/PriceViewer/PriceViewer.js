import './PriceViewer.css';
import { useEffect, useState } from 'react';
import PriceChart from '../PriceChart/PriceChart';

export default function PriceViewer() {
  const [priceData, setPriceData] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('ETH');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [timespan, setTimespan] = useState('24hr');

  useEffect(() => {
    const pairId = 'eth';
    fetch('/pair:' + pairId)
      .then(res => res.json())
      .then(data => setPriceData(data))
      .catch(err => console.error(err));
  }, []);

  const buttonClassName = buttonTimespan => (
    buttonTimespan === timespan
      ? 'PairPrice-timespanButton PairPrice-timespanButton-active'
      : 'PairPrice-timespanButton'
  );

  return (
    <div className='PairPrice'>
      <div className='PairPrice-currencyDisplay'>
        Price of
        <input className='PairPrice-currencyInput' value='ETH' />
        vs.
        <input className='PairPrice-currencyInput' value='USD' />
      </div>
      <div className='PairPrice-timespanSelection'>
        <button
          className={buttonClassName('24hr')}
          onClick={() => setTimespan('24hr')}
        >
          24hr
        </button>
        <button
          className={buttonClassName('1wk')}
          onClick={() => setTimespan('1wk')}
        >
          1wk
        </button>
        <button
          className={buttonClassName('1mo')}
          onClick={() => setTimespan('1mo')}
        >
          1mo
        </button>
        <button
          className={buttonClassName('6mo')}
          onClick={() => setTimespan('6mo')}
        >
          6mo
        </button>
        <button
          className={buttonClassName('1yr')}
          onClick={() => setTimespan('1yr')}
        >
          1yr
        </button>
      </div>
      {priceData.length
        ? <PriceChart priceData={priceData} quoteCurrency={quoteCurrency} />
        : 'Loading...'}
    </div>
  );
}
