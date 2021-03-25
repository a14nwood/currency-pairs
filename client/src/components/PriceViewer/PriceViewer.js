import './PriceViewer.css';
import { useEffect, useState } from 'react';
import PriceChart from '../PriceChart/PriceChart';

export default function PriceViewer() {
  const [priceData, setPriceData] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('ETH');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [timespan, setTimespan] = useState('1D');

  useEffect(() => {
    const pairId = 'USDC-WETH';
    fetch('/pair/:' + pairId)
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
        <input className='PairPrice-currencyInput' value='USDC' />
        vs.
        <input className='PairPrice-currencyInput' value='WETH' />
      </div>
      <div className='PairPrice-timespanSelection'>
        <button
          className={buttonClassName('1D')}
          onClick={() => setTimespan('1D')}
        >
          1D
        </button>
        <button
          className={buttonClassName('7D')}
          onClick={() => setTimespan('7D')}
        >
          7D
        </button>
        <button
          className={buttonClassName('30D')}
          onClick={() => setTimespan('30D')}
        >
          30D
        </button>
        <button
          className={buttonClassName('90D')}
          onClick={() => setTimespan('90D')}
        >
          90D
        </button>
        <button
          className={buttonClassName('365D')}
          onClick={() => setTimespan('365D')}
        >
          365D
        </button>
      </div>
      {priceData.length
        ? <PriceChart priceData={priceData} quoteCurrency={quoteCurrency} />
        : 'Loading...'}
    </div>
  );
}
