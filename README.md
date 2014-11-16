js-slider
=========

Pure Javascript Slider for Desktop and Mobile devices.

**options**

minvalue: a number representing the lowest value the slider represents

maxvalue: a number representing the highest value the slider represents

step: the gap in between each value on the slider

change: callback function when slider value changes

**methods**

getPercentage: returns the percentage (0 - 1) representing the current slider position

setPercentage(float): a method that takes a percentage (0 - 1) and sets the slider position accordingly

getValue: returns the actual value representing the current slider position

setValue(int): sets the actual value of the slider

onchange(Function): takes a function which is called when slider value changes 


