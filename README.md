# Moonshot-Stargazers
## Project Plan 

Our project development is divided into five milestones listed below. Because many of the milestones encapsulate broad goals, we will divide each milestone into subtasks for individual members or groups of members to work on. The creation of subtasks and division of work will be determined as we begin each milestone.

Though not explicitly listed in any milestone, we will work on our user interface incrementally throughout the semester, aiming to complete it by the end of Milestone 4. Similarly, while debugging is only listed in Milestone 5, it will be a continuous part of our project development, existent in all milestones but the main focus of only the fifth.

The boundaries between milestones are fuzzy. For instance, while Milestone 4 is projected to end by December 1, we will likely begin some work on Milestone 5 before then.

**Milestone 1:** set up our local development environments; get a globe visualization to run on our EC2 server; identify data source(s) 

**Milestone 2:** successfully scrape satellite data; display mock satellite data as data points on the globe visualization

**Milestone 3:** show orbital paths of satellites; use real-time data (not mock data) that updates regularly through web socket integration 

**Milestone 4:** finalize visualization settings and capabilities, including rotating, zooming, and filtering; field of view; collision notification; analytics and future projection; and CRUD operations (finish UI between Milestones 1 and 4) 

**Milestone 5:** debug, test, and refine our application as built thus far

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

## Milestone 1
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our end goal is to display real-time satellite data on a globe visualization, giving users the ability to navigate within the visualization, perform CRUD operations, predict collisions, and more. 

Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). We will provide more details on how to deploy the application in future milestones and our final report. 

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

By Milestone 1, we aimed to set up our local development environments, get a globe visualization to run on our EC2 server, and identify data source(s). By Milestone 2, we aimed to successfully scrape satellite data and display mock satellite data as data points on the globe visualization. Although we have not followed our project plan exactly, we are currently well ahead of schedule and working on Milestone 3. This involves showing orbital paths of satellites using real-time data (not mock data) that updates regularly through web socket integration. 
    
As of 10/17/2024, we have implemented requirements 1, 2, 3, and 4 above (see the Functional Requirements section). We have also implemented the following four requirements that were not part of our original project plan:
1. View a 2D visualization of the Earth and its atmosphere.
2. Allow users to search for locations or landmarks. When the location or landmark is identified, the application will automatically zoom in to it in the visualization.
3. Allow users to zoom out fully by clicking the Home button.
4. When a satellite in the visualization is clicked, its name, longitude, latitude, and altitude are displayed.

Our next focus is tackling requirement 8. As part of this requirement, we will also create a loading page. 

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

We only have one branch. 
