# SENG 513 - UI / API

The following System Requirements and Installation steps are required for running the project locally. <br>
If you are accessing the project remotely ([vivideradicator.ca](http://www.vivideradicator.ca)), you may skip to the Usage section of this document. <br>

## System Requirements
Ensure that the following are already installed on your operating system of choice. <br>
> Node JS <br>
> NPM <br>
> MongoDB

## Installation
User Interface
1. Clone or download the code found within the GitHub SENG513-UI repository, to a path/of/your/choosing <br>
1b. This can be done from within VS Code, via `git clone https://github.com/Rafael1321/SENG513-UI.git` <br>
2. Using the command prompt, `cd ~path/of/your/choosing/SENG513-UI` will navigate you to the proper directory <br>
3. Install all required project dependencies using `npm i` <br>
4. Run the application with `npm start` <br>
</br>

API <br>
Note that you must be running MongoDB before beginning this step. <br> 
Instructions can be found at https://www.mongodb.com/docs/manual/installation/ <br>
1. Clone or download the code found within the GitHub SENG513-API repository, to a path/of/your/choosing <br>
1b. This can be done from within VS Code, via `git clone https://github.com/Rafael1321/SENG513-API.git` <br>
2. Using the command prompt, `cd ~path/of/your/choosing/SENG513-API` will navigate you to the proper directory <br>
3. Install all required project dependencies using `npm i` <br>
4. Run the application with `npm start` <br> 

## Usage
The following steps can be used to experience the full functionality of the application. </br>

1. You will be greeted by the login/account registration page <br>
1b. If you do not yet have an account on DuoFinder, feel free to create one now. The 2 starter accounts below may also be used <br>
DO NOT use real password information here, it is not yet encrypted <br>
1c. Profile 1: email = vivideradicator@gmail.com password = seng513grading <br>
1d. Profile 2: email = me@vivideradicator.ca password = seng513grading <br>
2. Enter your email address and passwords into their respective fields <br>
3. Once logged in, the profile card can be seen. Clicking the edit button in the top right will enable customizing of your profile <br>
3b. You may change your profile picture, bio, gender, and age. Customize your profile as desired, and save the changes by pressing the same edit button again <br>
3c. Set your desired filters by pushing the 'Chat Filters' button, which will limit who you can match with based on your wishes <br>
4. To connect with another user, press the 'Find Duo' button <br>
4b. If you are wishing to test the functionality by yourself, simply log into another account on a seperate window and search for a match on both accounts <br>
5. Once connected, you may send messages in real-time to the other user. Pushing the 'Share Contact' button will automatically send your in-game information to the other user <br>
5b. Move onto another connection with the "Next" button, or return to your profile page by clicking the 'x' in the top-right corner <br>
6. Once back on your profile page, view your past matches with the 'Chat History' button <br>
6b. You may re-read past messages and give a rating to anyone you have talked to previously. To give a rating, press the top-right 'Rate Player' button <br>
7. Enjoy!

## Version History
*v1.0* <br>
Front-end only. Focus on creating a visually appealing and easy-to-use UI. <br>
Use-state-based system, where changes were not saved and lost upon refreshing/exiting the app. <br>
<br>
*v2.0* </br>
Introduced save states and a backend. User information now saved. <br>
*v2.1* </br>
Real-time data share between users made possible with sockets. <br>
<br>
*v3.0* <br>
Polishing of the app, squashing of several major bugs.  <br>
Small UI adjustments, ensuring all systems work as they should. <br>
<br>


## Contributors and Credit
Gaganjot Brar <br>
Harkamal Randhawa <br>
Martha Ibarra <br>
Rafael Flores Souza <br>
Richard Gingrich <br>
Tyler Chen 
