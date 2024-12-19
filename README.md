# Moonshot-Stargazers
## Links
[Application](http://35.173.229.2:3000/)

[Milestone 1 Demo](https://unomail-my.sharepoint.com/:v:/g/personal/ageringer_unomaha_edu/ETFxJY6_DKJDvMeYoD3-ScABbDWUxBSEOC7KpHbxyNv1nA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=Nbld6z)

[Milestone 2 Demo](https://unomail-my.sharepoint.com/:u:/g/personal/ageringer_unomaha_edu/EVQrkuLIZ81HtdeWwr-A-OABnSq9_CPl9FO2IVa61PN0TQ?e=xOMYdx)

[Milestone 3 Demo](https://unomail-my.sharepoint.com/:u:/g/personal/ageringer_unomaha_edu/EVhI3BW2HN5OjkPkmJQf5cMBnGURlSrv33VA7pbrthMBXw?e=cntZD7)

[Milestone 4 Demo](https://unomail-my.sharepoint.com/:v:/r/personal/ageringer_unomaha_edu/Documents/Recordings/Moonshot%20Stargazers%20-%20Milestone%204.mp4?csf=1&web=1&e=DqmulX&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

[Milestone 5 Long Demo](https://unomail-my.sharepoint.com/:v:/r/personal/ageringer_unomaha_edu/Documents/Recordings/Milestone%205.mp4?csf=1&web=1&e=i8Vn5f&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

[Milestone 5 Short Demo](https://unomail-my.sharepoint.com/:v:/r/personal/ageringer_unomaha_edu/Documents/Recordings/connect-20241215_204933-Meeting%20Recording.mp4?csf=1&web=1&e=edefAo&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

[Milestone 5 Poster Presentation](https://unomail-my.sharepoint.com/:v:/r/personal/ageringer_unomaha_edu/Documents/Capstone%20-%20Moonshot%20Stargazers/Presentations/Poster%20Presentation_NGR03.mp4?csf=1&web=1&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=W6qniV)


## Project Plan

Our project development is divided into five milestones listed below. Because many of the milestones encapsulate broad goals, we will divide each milestone into subtasks for individual members or groups of members to work on. The creation of subtasks and division of work will be determined as we begin each milestone.

Though not explicitly listed in any milestone, we will work on our user interface incrementally throughout the semester, aiming to complete it by the end of Milestone 4. Similarly, while debugging is only listed in Milestone 5, it will be a continuous part of our project development, existent in all milestones but the main focus of only the fifth.

The boundaries between milestones are fuzzy. For instance, while Milestone 4 is projected to end by December 1, we will likely begin some work on Milestone 5 before then.

**Milestone 1:** set up our local development environments; get a globe visualization to run on our EC2 server; identify data source(s)

**Milestone 2:** successfully scrape satellite data; display mock satellite data as data points on the globe visualization

**Milestone 3:** show orbital paths of satellites; use real-time data (not mock data) that updates regularly through web socket integration

**Milestone 4:** finalize visualization settings and capabilities, including rotating, zooming, and filtering; field of view; collision notification; analytics and future projection; and CRUD operations (finish UI between Milestones 1 and 4)

**Milestone 5 (final submission):** debug, test, and refine our application as built thus far

## Functional Requirements

The following is a list of requirements we wish to implement by the end of the semester:
1. View a 3D visualization of the Earth and its atmosphere.
2. Rotate within the visualization.
3. Zoom in and out within the visualization.
4. View data points in the visualization corresponding to satellites.
5. View lines in the visualization corresponding to the orbital paths of satellites.
6. Toggle between the views mentioned in requirements 4 and 5.
7. Filter the visualization to only view satellites of interest.
8. Use web socket integration to transfer and display real-time satellite data (not mock data).
9. Enable field of view visualization.
10. Simulate, predict, and be notified of collisions.
11. Allow users to perform future projection.
12. Allow users to perform CRUD operations on satellite data (including adding a new satellite to the visualization).

## Milestone 5
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our end goal is to display real-time satellite data on a globe visualization, giving users the ability to navigate within the visualization, perform CRUD operations, predict collisions, and more.

Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). Note that the link may not work if our server is not running.

Run the application:
1. Download the GitHub zip folder.
2. Extract the contents of the zip folder.
3. Open the extracted folder in an IDE like Visual Studio.
4. Install Node.js and Java.
5. If you are using Visual Studio, install an addon called Live Server.
6. Click on terminal and make sure your directory is in the contents of the extracted folder.
7. Type in the terminal capital S, hit tab and click enter.
8. Type in the terminal lowercase s, hit tab and click enter.
9. Install the required dependencies by typing npm run dev.
10. Copy the link and paste it into your browser. 

A note on testing: We performed manual tests only. We also relied on feedback from our sponsors.

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

12/19/2024

The following is a list of what is working in the final submission:
1. Render the 3D and 2D globe
2. Rotate
3. Zoom in and out
4. Choose multiple map styles
5. Click the home button to return to the default view
6. Search for locations on the globe
7. Select and deselect satellites by clicking on them
8. Display satellite name, longitude, latitude, and altitude in the information box
9. Show real-time satellite locations
10. Show real-time satellite orbital paths
11. Select a satellite with the filtering dropdown
12. Inject a satellite object into the application
13. Notify users of collisions

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

There are currently two branches in our repository, including the master branch and Coding_Two branch. In order to view the features showcased within the demo for Milestone 5, please review the Coding_Two branch. The master branch currently contains an alternative version of our application that aims to improve overall usability and performance by lessening the burden on the application front end.

## Milestone 4
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our end goal is to display real-time satellite data on a globe visualization, giving users the ability to navigate within the visualization, perform CRUD operations, predict collisions, and more.

Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). Note that the link may not work if our server is not running. We will provide more details on how to deploy the application in future milestones and our final report.

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

12/07/2024

During Milestone 4 we completed the satellite filtering feature. This was the last main feature that our sponsors wanted our team to complete before the end of the semester. Moving forward, we have two goals:
First, we want to polish our project, including fixing a bug where the latitude, longitude, and altitude data for each satellite is not displaying in the bottom-left information box. Our second goal is to finish deploying the project on our AWS server, as we've primarily been working in our local environments. On the side, we will also work on testing. 

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

There are currently two branches in our repository, including the master branch and Coding_Two branch. In order to view the features showcased within the demo for Milestone 4, please review the Coding_Two branch. The master branch currently contains an alternative version of our application that aims to improve overall usability and performance by lessening the burden on the application front end.


## Milestone 3
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our end goal is to display real-time satellite data on a globe visualization, giving users the ability to navigate within the visualization, perform CRUD operations, predict collisions, and more.

Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). Note that the link may not work if our server is not running. We will provide more details on how to deploy the application in future milestones and our final report.

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

11/26/2024

In Milestone 3 we aimed to implement visualization of the orbital paths of satellites and to use real-time data instead of mock data that is regularly updated via web socket integration.

Milestone 3 successfully displays the orbital paths of satellites, which are viewable to the user upon clicking on a given satellite. Some orbital paths display irregularly, but we confirmed with the sponsors that this may be normal for some satellite objects. Additionally, this milestone retains the successful implementation of real-time satellite data, with the addition that the TLE data is now propagated every 5 minutes over a 24-hour interval to reflect the full orbital path of a satellite. Functional requirements 10 and 12 have also been met within Milestone 3, both of which were originally planned for Milestone 4. Users can now interact with the "Add a New Satellite" box in the top left of the application in order to input a new satellite into the application. Upon successful input from the user (two complete lines of TLE data and a selected name), a new satellite is added and the TLE data and calculated propagation for orbital paths are compared in order to detect collisions. If a collision is detected, the user is shown a popup notifying them of the detection as well as an additional box that lists specific details pertaining to where each potential collision was detected. 

In the next milestone, our team aims to fix existing bugs such as certain satellite data not populating (longitude, latitude, height) in the satellite information box when one is selected. Additionally, we are still working towards a solution for the complete deselection of a satellite. Our sponsors provided us with a priority list for the remainder of the project, which our team is dedicated to achieving by the final milestone. The priority list includes the following (in order): 1. Filtering, 2. Deploying the project as a containerized app (for a customer), 3. Polishing and improving existing features and UI, 4. Field of view visualization, and 5. Testing and merging branches to obtain a final and complete version.

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

There are currently two branches in our repository, including the master branch and Coding_Two branch. In order to view the features showcased within the demo for Milestone 3, please review the Coding_Two branch. The master branch currently contains an alternative version of our application that aims to improve overall usability and performance by lessening the burden on the application front end.


## Milestone 2
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our end goal is to display real-time satellite data on a globe visualization, giving users the ability to navigate within the visualization, perform CRUD operations, predict collisions, and more.

Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). Note that the link may not work if our server is not running. We will provide more details on how to deploy the application in future milestones and our final report.

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

11/09/2024

By Milestone 2, we originally aimed to scrape live satellite data and display mock satellite data as data points on a globe visualization. However, we largely met our Milestone 2 goals during Milestone 1, so after Milestone 1, we decided to focus on our Milestone 3 goals, which included showing the orbital paths of satellites using real-time data that updates regularly through web socket integration. We also considered designing a loading page to display while the initial satellite data is fetched and each satellite object is rendered.

As of 11/09/2024, our application successfully shows the real-time movement of satellites within our globe visualization. All features added during Milestone 1 remain working. To summarize, in addition to the functional requirements met during Milestone 1 (1, 2, 3, 4, and others not initially specified), we have now met requirement 8 (see list above). Because the satellite data and objects load quickly enough, we decided not to create a loading page.

Moving forward, we aim to do two things: fix bugs and add new features. Our application has two significant bugs. First, once a satellite is clicked on, we are unable to deselect it and zoom out. Second, once a satellite is clicked on, its latitude, longitude, and altitude data should populate in a box in the bottom left corner of the screen. The data is not currently populating. In addition to fixing these two bugs, we aim to complete the original goals of Milestone 3. While our satellite objects move in real-time based on TLE data, we have not yet coded lines indicating their orbital paths. Once we finish these three tasks, we plan to move on to the requirements initially specified for Milestone 4. These include filtering, CRUD operations (e.g., insert or delete a satellite object), collision detection, and future projection. These roughly correspond to requirements 5-7 and 9-12 in the list above. While we do not plan to have all requirements complete by the next milestone, we would like to have made progress on several of them.

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

All code for Milestone 2 is in the master branch (it is the only branch that must be reviewed). The Coding_Two branch was used during the development of the Milestone 2 features.

## Milestone 1
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our end goal is to display real-time satellite data on a globe visualization, giving users the ability to navigate within the visualization, perform CRUD operations, predict collisions, and more.

Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). Note that the link may not work if our server is not currently running. We will provide more details on how to deploy the application in future milestones and our final report.

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

10/17/2024

By Milestone 1, we aimed to set up our local development environments, get a globe visualization to run on our EC2 server, and identify data source(s). By Milestone 2, we aimed to successfully scrape satellite data and display mock satellite data as data points on the globe visualization. Although we have not followed our project plan exactly, we are currently well ahead of schedule and working on Milestone 3. This involves showing orbital paths of satellites using real-time data (not mock data) that updates regularly through web socket integration.

As of 10/17/2024, we have implemented requirements 1, 2, 3, and 4 above (see the Functional Requirements section). We have also implemented the following four requirements that were not part of our original project plan:
1. View a 2D visualization of the Earth and its atmosphere in different map styles.
2. Allow users to search for locations or landmarks. When the location or landmark is identified, the application will automatically zoom in to it in the visualization.
3. Allow users to zoom out fully by clicking the Home button.
4. When a satellite in the visualization is clicked, its name, longitude, latitude, and altitude are displayed.

Our next focus is tackling requirement 8. As part of this requirement, we will also create a loading page.

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

We only have one branch. We are also currently working on some other features within our local environments. 
