## BANNER STANDART TEMPLATE

### DESCRIPTION

This repository offers a diferent way for developing standart banners. When you try this, you will check how your production performance has been improved.

### REQUERIMENTS

Before starting, you need to save images to the banner size (as .png or .jpg) because in the template, the images are positioned absolutely, in left 0 and top 0...
Furthermore, you need to know the [GSAP] (https://greensock.com/gsap) libraries because this template use those for animating.

### CUSTOMIZING THE FRAME OBJECT

In the index.html you will find the frame Object. Firstly, You should decide the frames number of your banner (it depends on the animation). Once you have decide it, you must choose the frame order into frame object for positioning the div have been created (with an id equal to name of the frame that you have choosen) inside the banner container div. Finally, you have to push into the frame array the image src for each image you going to use and you have to put in the correct order for positioning into each frame.