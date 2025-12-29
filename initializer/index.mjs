import axios from 'axios'
import 'dotenv/config'

const urls = process.env.MACHINES.split(", ")

const interval = process.env.ORDER_INTERVAL || 4000
const delay = process.env.INITIAL_DELAY || 1000
const orders = process.env.NUMBER_OF_ORDERS || 3
const kiosk = process.env.KIOSK || 1

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function statusGet(urlIn) {
  try {
    const response = await axios.get("http://"+urlIn+"/status");
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function runsimGet(urlIn, num) {
	try {
		const currentDelay = delay*num
		const orderURL = `http://${urlIn}/runsim?orders=${orders}&kiosk=${kiosk}&delay=${currentDelay}&interval=${interval}`
		console.log(`trying ${orderURL}`)
		const response = await axios.get(orderURL)
	} catch (error) {
		console.error( 'error trying request', error)
	}
}

const tryList = async (orderNum) => {
	while (orderNum > 0) {
		//console.log(`trying ${urls[orderNum-1]}`)
		//statusGet(urls[orderNum-1])
		
		runsimGet(urls[orderNum-1], orderNum)

		await sleep(3000)
		orderNum -= 1
	}
}

tryList(urls.length)