# Moonshot-Stargazers
## Milestone 1
### What is the application? How do you use it?
**Explain what the application is all about and how to use it.**

This application is a satellite visualization tool created by the UNO Fall 2024 CSCI4970-001 capstone group Moonshot Stargazers (NGR03) in collaboration with Northrop Grumman. Our application is deployed on an Amazon EC2 server and can be accessed [here](http://35.173.229.2:3000/). We will provide more details on how to deploy the application in future milestones and our final report. 

### Release Notes
**Explain what is working in this submission (add an explanation if this is not consistent with the milestone as described in the project plan).**

By Milestone 1, we aimed to set up our local development environments, get a globe visualization to run on our EC2 server, and identify data source(s). By Milestone 2, we aimed to successfully scrape satellite data and display mock satellite data as data points on the globe visualization. Although we have not followed out project plan exactly, we are currently working on Milestone 3. This involves showing orbital paths of satellites using real-time data (not mock data) that updates regularly through web socket integration. 

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
    
As of 10/17/2024, we have implemented requirements 1, 2, 3, and 4 above. We have also implemented the following four requirements that were not part of our original project plan:
1. View a 2D visualization of the Earth and its atmosphere.
2. Allow users to search for locations or landmarks. When the location or landmark is identified, the application will automatically zoom in to it in the visualization.
3. Allow users to zoom out fully by clicking the Home button.
4. When a satellite in the visualization is clicked, its name, longitude, latitude, and height are displayed.

Our next focus will be tackling requirement 8. As part of this requirement, we will also create loading page. 

### Branches
**If code is in more than one branch (for example, alternative implementations, features not yet integrated, experimental code, etc.), list the additional branches I should review and explain what is in them.**

We only have one branch. 





