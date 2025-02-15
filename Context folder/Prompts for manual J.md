Prompts:


to get our room numbers and square footages for each room

prompt 1:
make a list of rooms on this house plan,  with accurate dimensions of each room with dimensions

then calculate the square footage for each room

End prompt

store the output of this prompt for use below

Prompt 2:
input the PDF building plan, and the stored room numbers and square footages for each room before entering this prompt

For each room and for the building as a whole
calculate the exterior surface area of walls (that touch unconditioned space)
interior surface area of walls
Interior space (volume of air)

the lineal feet of slab-edge per room (edge of slab exposed to outside air, for calculating slab heat loss, its only the slab edge underneath walls that touch unconditioned space)

output a nicely organized data table with the values for each room, and a total for the house




to get our window and orientation values from gemini
attach the PDF building plan, pass in the room numbers and square footages as context and then use these 2 prompts in order

prompt 1:
Make a list of rooms per floor, for each room
list the windows, with the exact dimensions of the windows, and which direction the windows face

Such as
Bedroom 1: 2 west facing windows, 3040, 3'x4' each =12' x 2 windows =. 24square feet of west facing windows
Bedroom 2: 2 west facing windows, 1 north facing window: West facing windows are 3060 3*6=18*2=36sqft of west facing window, and 1 north facing window of 4060=24Sqft of north facing window

Etc, make sure to count the the windows in the house, and check that your final count of all the rooms matches the initial count of the house for perfect accuracy


End of prompt 1

after we get a response

Prompt 2: 

can you output this data in a table for easy reference?
make sure include the window count, square footage, orientation totals and for each room individually
Total the window surface area for each direction


to get our location data
If location is not specified, use the chat tool to request the location from the user

once we have a address or zip code
use the following prompt to get our location specific weather data

Prompt:
Find the outdoor design temperatures for this location

Assuming a 75 degree indoor cooling thermostat set point in the summer, and assuming a 70 degree indoor heating thermostat setpoint in the winter

find the closest weather data and calculate the Heating Degree days for each month
input customers address or zip code

and these thermostat set points
75 for cooling in the summer
70 for heating in the winter

Find me the following information
99% Outdoor design temperature (used commonly for calculating Manual J heat loss calculations)

Heating degree days per month for this location based on a thermostat heating startpoint of 65 degrees in heating and 72 degrees in cooling (meaning when the outdoor air temperature drops to or below 65 degrees heating is required, if the outdoor air temperature goes above 74 degrees cooling is required


to get our duct heat loss estimate
Input the room by room heat load output results and the follwing prompt

Prompt:


to add our duct loss into our manual J calculation
take the output of the duct heat loss estimate, and use the following prompt

here is the duct heat loss we expect for this house
add it in to the room by room heat loss we've added in to chat for context

the output should be an accurate Manual J heat loss for the house

Heat loss from the duct should be assigned based one each rooms percent of delivered air flow (required CFM per room for heating and cooling)

For instance if the house uses 900 CFM, and the kitchen is 180cfm of the 900CFM, add 20% of the duct heat loss to the room by room heat loss for the kitchen to get the final heat load for the kitchen.