import React, {useEffect, useState} from 'react'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

function App() {
  const bgImageUrl = `https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80`

  const [prices, setPrices] = useState({})


  useEffect(() => {
    const makeCall = async () => {
      const btcRes = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
      const ethRes = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot')
      const executiveRes = await fetch('https://api.opensea.io/api/v1/collection/poolsuite-executive-member')
      const poolRes = await fetch('https://api.opensea.io/api/v1/collection/poolsuite-pool-member')
      const btcBody = await btcRes.json()
      const ethBody = await ethRes.json()
      const executiveBody = await executiveRes.json()
      const poolBody = await poolRes.json()
      setPrices({
        btc: btcBody.data.amount,
        eth: ethBody.data.amount,
        executive: executiveBody.collection.stats.floor_price,
        pool: poolBody.collection.stats.floor_price,
      })
    }
    makeCall()
  }, []) 

  console.log({prices})
  return (
    <div style={styles.container}>
      <div style={styles.bg(bgImageUrl)}>
        <div style={styles.title}>
          <span style={{...styles.titleText, ...styles.text}}>
            Memento Mori
          </span>
        </div>
        <div style={{...styles.section, ...styles.croakSection}}>
          <Boxes total={4000} used={1800} />
        </div>
        <PriceSection prices={prices} />
      </div>
    </div>
  );
}

const PriceSection = ({prices}) => <div style={{...styles.section, ...styles.priceSection}}>
  <p style={{...styles.text, ...styles.price}}><span>BTC: </span><span>{formatter.format(prices.btc)}</span></p>
  <p style={{...styles.text, ...styles.price}}><span>ETH: </span> <span>{formatter.format(prices.eth)}</span></p>
  <p style={{...styles.text, ...styles.price}}><span>Executive:  </span><span>{formatter.format(prices.executive).replace("$", "ETH ")}</span></p>
  <p style={{...styles.text, ...styles.price}}><span>Pool:  </span><span>{formatter.format(prices.pool).replace("$", "ETH ")}</span></p>
</div>

  const bluegreen = '#2a3a4a90'
const bluegreenfull = '#2a3a4a'
const offwhite = '#eaeaea'
const offwhiteopac = '#eaeaea70'

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    color: offwhite,
  },
  bg: url => ({
    flex: 1,
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
  }),
  title: {
    flex: 1,
    textAlign: 'center',
  },
  titleText: {
    padding: '2px 5px',
    fontSize: 72,
  },
  section: {
    marginLeft: '20vw',
    marginTop: 20,
    maxWidth: '60vw',
  },
  text: {
    backgroundColor: bluegreen,
  },
  price: {
    padding: '2px 5px',
    fontSize: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  priceSection: {
    maxWidth: '40vw',
  },
  croakSection: {
    backgroundColor: '#ffffff22',
    padding: 10,
  },
  box: filled => ({
    border: '1px black solid',
    backgroundColor: filled ? bluegreenfull : offwhiteopac,
    width: 5,
    height: 5,
    margin: '1px 1px 1px 0',
    display: 'inline-block',
  }),
}

const Box = ({filled=false}) => {
  return (
    <div style={styles.box(filled)}></div>
  )
}

const Boxes = ({used, total}) => {
  console.log({used})
  const boxes = []
  let i
  for (i=0;  i < Number(used); i++) {
    boxes.push(<Box filled={true} key={i} />)
  }

  for (i=0;  i < Number(total) - Number(used); i++) {
    boxes.push(<Box filled={false} key={i+Number(used)} />)
  }

  return boxes
}

export default App;
