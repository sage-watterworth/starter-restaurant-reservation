
# Final Capstone


## Description
The restaurant reservation system allows a user to create, update, and edit a reservation. The user can also seat a reservation at a specified table, create more tables, and finish a reservation to free up an existing table.

**View the live site [here.](https://frontend-reservation.herokuapp.com/dashboard)**

-------

**Run Locally**
* Fork and clone this repository.
* Run cp ./back-end/.env.sample ./back-end/.env.
* Update the ./back-end/.env file with db connections. You can set some up for free with ElephantSQL database instances.
* Run cp ./front-end/.env.sample ./front-end/.env.
* You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than http://localhost:5000.
* Run npm install to install project dependencies.
* Run npm run start:dev from the back-end directory to start your server in development mode.
* Run npm start from the front-end directory to start the React app at http://localhost:3000.

--------

**Technologies used:**

- HTML
- CSS
  - Bootstrap 4
- JavaScript
- React
  - React hooks
  - React router
- Node
- Express
- Postgres
- Knex
- RESTful APIs


**Project walkthrough**

*View Dashboard*
![View Dashboard](front-end/project-screenshots/view-dashboard-closed.png)
The dashboard will show a list of reservations for the current date, and a list of tables with the status of free or occupied. Toggle to view different dates by selecting yesterday, today, and tomorrow. The URL slug will let you know what date you are viewing.


*View Dashboard Expanded*
![View Dashboard Expanded](front-end/project-screenshots/view-dashboard-expand.png)
Click on the reservation name to expand the reservation and reveal more options for editing, seating, and canceling a reservation.


*Create a reservation*
![Create a reservation](front-end/project-screenshots/create-reservation.png)
To create a new resevation, navigate to the side bar menu and find "New Reservation". Here you will fill out the form for a new reservation and click submit when done. You will be taken back to the dashboard for the newly created reservations date.


*Searc a reservation*
![Search a reservation](front-end/project-screenshots/search-reservation.png)
To search for a specific reservation, navigate to the side bar menu and find "Search". Here you will have the option to enter a customer's mobile number to find their existing reservation.


*Seat a table*
![Seat a table](front-end/project-screenshots/seat-table.png)
Your party has arrived and you're read to seat the reservation. Navigate to the dashboard and find the reservation you would like to seat- make sure it is expanded. Click on the seat button, toggle "select a table" and search for a table with the right amount of occupincy for the party size. Click submit and you will be taken back to the dashboard, where you will eventually want to select "finish" and end the reservation when its party leaves. This will free up the table to be used again.

------
## API Reference

| URL | Method     | Description                |
| :-------- | :------- | :------------------------- |
| `/reservations?date=YYYY-MM-DD` | GET: | Lists all reservations for the date specified |
| `/reservations?mobile_number=999-999-9999` | GET: | Lists all reservations for the mobile number specified |
| `/reservations` | POST: | Creates a new reservation |
| `/reservations/:reservationId` | GET: | Grabs reservation by specified ID |
| `/reservations/:reservationId` | PUT: | Updates reservation by specified ID |
| `/tables` | GET: | Lists all tables |
| `/tables` | POST: | Creates a new table |
| `/tables/:table_id/seat` | PUT: | Seats a reservation at a specified table |
| `/tables/:table_id/seat` | DELETE: | Finishes a reservation to free up the table |
