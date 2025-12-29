import axios from 'axios'
import 'dotenv/config'
import express from 'express'
import inNames from './first-names.json' with { type: 'json'}
import inOrder from "./order-example.json" with {type: 'json'}
import {randomInt} from './utils.mjs'

const dbURL = process.env.DB_URL

	//stagger the timing between paypad orders
const initialDelay = 202
const orderTime = 6000

let statusMaster = "idle"

let orderKiosk = 1
let newItem = 1
const outName = inNames[randomInt(0,4945)] + String(randomInt(100000000,999999999))
const phone = String(randomInt(1000000000,9999999999))
const newId = outName + "-+1 " + phone + "::" + outName + "@test.com" 

const targetKiosk = 2 //sweet kiosk
//sweets = 4, 5, 6
const targetItem = randomInt(4,6)

inOrder.user_profile.id = newId
inOrder.user_profile.firstName = outName
inOrder.items[0].id = targetItem

const getty = dbURL +"orders?latest=1"
const posty = dbURL + "orders"

const genNewOrder = () => {
	const newOutName = inNames[randomInt(0,4945)] + String(randomInt(100000000,999999999))
	const newPhone = String(randomInt(1000000000,9999999999))
	const newId = newOutName + "-+1 " + newPhone + "::" + newOutName + "@test.com" 
	
	if (orderKiosk==1) {
		newItem = randomInt(1,3)
		inOrder.kiosk_type = "juice"
	}
	else if (orderKiosk==2) {
		newItem = randomInt(4,6)
		inOrder.kiosk_type = "sweet"
	}
	inOrder.user_profile.id = newId
	inOrder.user_profile.firstName = newOutName
	inOrder.kiosk_id = orderKiosk
	inOrder.items[0].id = newItem

	const outOrder = inOrder
	return outOrder
}

async function orderGet() {
  try {
    const response = await axios.get(getty);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const postData = async () => {
  try {
    const response = await axios.post(posty, inOrder);

    console.log(response.data);

  } catch (error) {
    console.error(error);
  }
};

const postOrder = async (orderIn) => {
  try {
    const response = await axios.post(posty, orderIn);

    console.log(response.data);

  } catch (error) {
    console.error(error);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitToTryOrder = async (orderNum, intervally, initialDelay) => {
	statusMaster = "RUNNING SIMULATION PLEASE WAIT"
	await sleep(initialDelay)
	tryOrder(orderNum, intervally) 
}

const tryOrder = async (orderNum, intervally) => {
	while (orderNum > 0) {
		//const newOrder = genNewOrder()
		//console.log(newOrder)
		postOrder(genNewOrder())
		console.log(`ordering ${orderNum}`)
		await sleep(intervally)
		orderNum -= 1
	}
	console.log("ordering complete")
	statusMaster = "idle"
}

const app = express();
const port = 3434;

app.get('/', (req,res) => {
	res.send('sup')
	console.log('received / request')
})

app.get('/info', (req, res) => {
	const helpo = {
		"command" : {
			"runsim" : "do a sim ordering",
			"status": "see if we're running or waiting"
		},
		"args": {
			"orders": "number of orders to place",
			"delay": "the initial delay in milliseconds to stagger ordering by",
			"interval": "the interval in milliseconds in which to place orders",
			"kiosk": "the kiosk number to use, kiosk 1 = juice / kiosk 2 = sweets"
			}
	}
	const datas = {
		message: helpo,
		status: 200
	}
	res.json(datas)
})
app.get('/status', (req,res) => {
	const currentStatus = statusMaster
	const datas = {
		message: statusMaster,
		status: 200
	}
	res.json(datas)
})
//localhost:3434/runsim?orders=10&kiosk=2&delay=200&interval=4000


app.get('/runsim', (req,res) => {
	const initialDelay = req.query.delay
	const interval = req.query.interval
	const kiosknum = req.query.kiosk
	const orders = req.query.orders
	
	orderKiosk = kiosknum

	if (initialDelay && interval) {
		res.send(`scheduling simulated ordering of ${orders} orders with ${initialDelay} delay and ${interval} timing to kiosk ${kiosknum}`)
	}
	else {
		res.send('please provide a ORDERS, KIOSK, DELAY, and INTERVAL argument')
	}
	console.log(`received request to run simulated ordering of ${orders} orders with ${initialDelay} delay and ${interval} timing to kiosk ${kiosknum}`)
	waitToTryOrder(orders,interval,initialDelay)
	//tryOrder(orders,interval)
})
app.listen(port, () => {
	console.log(`listening on porty ${port}`)
})






