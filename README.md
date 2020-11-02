# CMUEscortEasy
## Project background
This is actually my final project for 112 course in CMU. It is a web app for school bus booking system.
I finished whole things in almost two weeks including UI design and being familiar with Django framework.
It is immature but I think it is fine being my first Django project. The idea of this project came out of 
my mind when I know there is a final project. Every night, I caught school bus (officially escort) at back
door of libaray. But I found the bus system looks like inefficient since no one knows if there are enough 
seats for all students in the queue. Missing an incoming bus means waiting for another hour. After talking
with bus drivers on my way home and my classmates after class, I decided to let the app have following
functions:
- pick up seats on line
- generate optimized routing for bus
- visualize statistical data for management

## App Hierarchy
### Page one
Login page for students, drivers and managers.

### Page two
Seats pick up results are vsiaulized like the online booking system for cinema.

### Page three
Based on students' destination information, the system will automatically generate
optimized route for a bus based on Dijkastra algorithm. And the route will be
visualized on google map.

### Page four
Based on students' information, the system will generate statistical analysis results
and visualize the results.

## Django framework
Django framework is suitable for creating a website in a short time. And it looks like
the framework is not good at concurrency which means the website will probably crash
when many users visiting the system at the same time. Suitable tools make you smile :)
