# ensek-api-test
ensek api tests

In order to run the tests you open either an IDE and target the base directory and run through the terminal using the following commands:

npx codeceptjs run --steps
npx codeceptjs run --verbose (a complete console output of commands)
npx codeceptjs run --grep "authourisation" --steps (in order to run just the authourisation tests)
npx codeceptjs run --grep "ordering" --steps (in order to run just the ordering tests)

Known Issues:

1) Inconsistent 500 response errors retrieving an access token. I've added a loop to try get around this but this would be raised as a defect

2) When ordering Gas
	a) response message quantity and units remaining are the wrong way round
	
3) When ordering electric	
	a) response body for /orders displays invalid id key as "Id" instead of, "id", and invalid value, "Elect", instead of "electric"
	
4) When ordering oil
	a) response message calculates total cost incorrect (0.5 * 2)
	b) response body for /orders displays invalid id key as "Id" and invalid value, "Oil" instead of "oil"

5) When ordering an over-amount of energy
	a) The order is still processed and the order returns in /orders
	b) Expect an error to be returned stating the order exceeds the quantity so therefore cant be processed
	
		
