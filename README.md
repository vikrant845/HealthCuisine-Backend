# HealthCuisine A FullStack App (Backend Part)
This is the backend part of this MEAN stack app (HealthCuisine). This is a fitness and nutrition app in progress. Users can search for exercises, like them, there's a dashboard which shows various user details. People need resources to start their fitness journey somewhere. This app can be that resource.

Adding custom workouts, viewing the user posted workouts, adding customized nutrition feature are some of the things to be added in the future.

# Technologies Used
1. Angular
2. Node Js
3. MongoDB
4. Express Js
5. Angular Animations
6. GSAP Library
7. Angular Material UI Components

# Working demo of the project
https://health-cuisine.onrender.com/

Login Credentials
Username: atuny0
Password: atuny0@123

# How to run the project
Once you clone the project, make sure you have node installed in your system. Open the clone in vs code or any editor of your choice. On your system's terminal/cmd navigate to your clone directory and run npm install. This installs all dependencies present in the package.json. Now simply create an config.env file in the main folder and add these in the file  
MONGODB_URL=Your mongodb url  
MONGODB_PASSWORD=Your mongodb password  
  
EMAIL_FROM=Your email configuration  
EMAIL_HOST=Your email configuration  
EMAIL_PORT=Your email configuration  
EMAIL_USERNAME=Your email configuration  
EMAIL_PASSWORD=Your email configuration  
  
JWT_SECRET=YOUR_JWT_SECRET  
JWT_EXPIRES_IN=YOU_JWT_EXPIRY  
  
Now run nodemon app.js in terminal on your project directory in the terminal. Your app will start.
