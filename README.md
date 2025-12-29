1. install node
2. install packages 
	npm install
3. create .env and copy .env.example to it 
	change the database url to the backend server url we are using
3. run node index.mjs
4. make http get request to IP:3434/runsim?orders=3&kiosk=2&delay=200&interval=10000
5. let them cook
6. make http get request to IP:3434/info to see more

if you have the stress-test server installed on a virtual instance, you can then install the initializer, and use it to automate multiple stress tests oon seperate virtual instances at once