/*
  Slider version 1.0
  Stayko Chalakov
  31/10/2014 
*/
( function( window, undefined ) {

  function Slider(el, opts) {
    
    /**************
     GLOBAL VARS
    ***************/

    var that = this;

    //configurables        
    var opts = opts || {},
        el = el,
        minvalue = opts.minvalue || 0,
        maxvalue = opts.maxvalue || 10,
        step = opts.step || 1,
        change = opts.change || null; 

    //create elements and variables
    var dragging = false, //if dragger handle is being dragged
        draggerStartPos, //the starting position (x coordinate) of dragger 
        lineWidth, 
        currentValue = 0,   
        range = (maxvalue - minvalue) / step, //draggable positions
        fraction, //a draggable position in pxs
        clientX, 
        clientY, 

        holder = document.createElement("div"),
        line = document.createElement("div"),
        dragger = document.createElement("div");

    //the custom event that will be created  
    var event; 
    
    /**************
     PRIVATE SCOPE
    ***************/

    /* 
     * Check if it's a touch device
     */ 
    var _isMobile = {
        Android: function() {
            return /Android/i.test(navigator.userAgent);
        },
        BlackBerry: function() {
            return /BlackBerry/i.test(navigator.userAgent);
        },
        iOS: function() {
            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        },
        Windows: function() {
            return /IEMobile/i.test(navigator.userAgent);
        },
        any: function() {
            return (_isMobile.Android() || _isMobile.BlackBerry() || _isMobile.iOS() || _isMobile.Windows());
        }
    };

    /*
     * Main initialisation function 
     */
    var _init = function(){
      //construct interface     
      holder.setAttribute("class", "slider-holder");
      line.setAttribute("class", "slider-line");      
      dragger.setAttribute("class", "slider-dragger");

      line.appendChild(dragger);
      holder.appendChild(line);
      el.appendChild(holder); 

      lineWidth = line.offsetWidth - dragger.offsetWidth; 
      fraction = lineWidth / range; 

      if(_isMobile.any()) {
        //handling touch events
        dragger.addEventListener("touchstart", _dragStart, false);
      } else {
        //bind event handlers 
        dragger.onmousedown = _dragStart;  
      } 

      _initChangeEvent();
    }

    /*
     * Create a custom change event for slider  
     */
    var _initChangeEvent = function(){
      //custom event creation 
      if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("change", true, true);
      } else {
        event = document.createEventObject();
        event.eventType = "change";
      }
      event.eventName = "change";
    }

    /*
     * Dispatches the event 
     */
    var _fireChangeEvent = function(){
      if (document.createEvent) {
        el.dispatchEvent(event);
      } else {
        el.fireEvent("on" + event.eventType, event);
      }
    }

    /*
     * Function called when onmousedown/touchstart event is fired   
     * @param {Object} e Event object   
     */
    var _dragStart = function(e){
      if(!e){ e = window.event; }
      e.preventDefault();

      //flag to indicate we have strated dragging
      dragging = true;

      if(_isMobile.any()){
        dragger.addEventListener("touchmove", _dragMove, false);
        dragger.addEventListener("touchend", _dragStop, false);
      } else {
        window.addEventListener("mousemove", _dragMove, false);
        window.addEventListener("mouseup", _dragStop, false);
      }

      if(e.changedTouches !== undefined){
        clientX = e.changedTouches[0].pageX;
        clientY = e.changedTouches[0].pageY; 
      } else {
        clientX = e.clientX; 
        clientY = e.clientY; 
      }

      //work out the start position of the dragger minus the x coordinate of where the user clicked
      draggerStartPos = (clientX - dragger.offsetLeft) - (holder.offsetLeft + line.offsetLeft); 
    }

    /*
     * Function called when onmousemove/touchmove event is fired
     * @param {Object} e Event object      
     */
    var _dragMove = function(e){
      if(!e){ e = window.event; }
      e.preventDefault();

      if(dragging === true) {
        //prevent cursor to switching to default one  
        document.body.style.cursor = 'pointer';

        if(e.changedTouches !== undefined){
          clientX = e.changedTouches[0].pageX;
          clientY = e.changedTouches[0].pageY; 
        } else {
          clientX = e.clientX; 
          clientY = e.clientY; 
        }

        //work out new position of dragger
        var newPos = (clientX - draggerStartPos) - (holder.offsetLeft + line.offsetLeft);

        var prevDraggerPos = dragger.offsetLeft; 

        //check if dragger is within the boundaries i.e. the width of the line
        if(newPos > 0 && newPos < lineWidth){
          currentValue = Math.round(newPos / fraction); 
          dragger.style.left = (fraction * currentValue) + 'px';

          currentValue = currentValue * step; 
          currentValue += minvalue;

        } else if (newPos <= 0){
          
          currentValue = minvalue;  
          dragger.style.left = 0 + 'px';
          newPos = 1; 

        } else if(newPos >= lineWidth){

          currentValue = maxvalue; 
          dragger.style.left = lineWidth + 'px';
          newPos = lineWidth; 

        }

        //only call the callback and fire change event if the dragger position changes
        if(prevDraggerPos != dragger.offsetLeft){
          _fireChangeEvent();
          if(change !== null) change(currentValue);
        }

      }
    }

    /*
     * Function called when onmouseup/touchend event is fired  
     * @param {Object} e Event object   
     */
    var _dragStop = function(e){
      if(!e){ e = window.event; }
      e.preventDefault();

      if(_isMobile.any()){
        dragger.removeEventListener('touchmove', _dragMove);
        dragger.removeEventListener('touchend', _dragStop);
      } else {
        //clear the handler functions
        window.removeEventListener("mousemove", _dragMove);
        window.removeEventListener("mouseup", _dragStop);
      }

      dragging = false;
      //revert to default cursor 
      document.body.style.cursor = 'default'; 
    }


    /**************
     PUBLIC SCOPE
    ***************/

    /*
     * Returns the current value of slider as a percentage
     *
     * @return {float} Current slider value as a percentage
     * between 0 and 1  
     */
    this.getPercentage = function getPercentage() {
       var percent = ( (fraction * (currentValue/step)) / (lineWidth / 100) ) / 100; 
       return (percent === 1 || percent === 0) ? percent : percent.toFixed(2);  
    };
    
    /*
     * Set the dragger's current value to a percentage
     *
     * @param {float} perc Percentage value to set the slider to
     */
    this.setPercentage = function setPercentage(perc) {
        var p = perc * 100, 
            r = 100/range,
            v = Math.round(p / r) * step;  

        that.setValue(v);
    };

    /*
     * Returns the current value of the slider as an integer  
     *
     * @return {int} Current slider value
     */
    this.getValue = function getValue() {
      return currentValue;
    };
    
    /*
     * Sets the current value of the slider   
     *
     * @param {int} val Value to set the slider to     
     */
    this.setValue = function setValue(val) {
      dragger.style.left = (fraction * (val/step)) + 'px';
      currentValue = val; 
      currentValue += minvalue;

      //trigger change event
      _fireChangeEvent();
      if(change !== null) change(currentValue);
    };

    /*
    * Calls the parameter function when slider's value
    * has changed
    *
    * @param {function} f Function to call when slider's
    * value changes
    */
    this.onchange = function(f){
      el.addEventListener('change', function (e) {
        f(currentValue);
      }, false);
    } 
    

    /**************
     INITIALISE 
    ***************/

    _init();

  }

  // expose access to the constructor
  window.Slider = Slider;
 

} )( window );