var Banner = (function(){
  function Banner(containerBanner,imgPath,frameObj,clicktagFunction,timelineObj){
    Banner.scope = this;

    this.containerBanner = containerBanner;
    this.imgPath = imgPath;
    this.frameData = frameObj;
    this.timelineData = timelineObj;
    this.dataBanner;

    this.arrayFrames = [];
    this.arrayElements = [];

    this.counterImg = 0;
    this.totalImg = 0;

    this.iteration = 0;
    this.numTween = 0;
    this.lastLabelName;

    this.clicktagFunction = clicktagFunction;

    this.configureBanner();
  }

  Banner.prototype.configureBanner = function(){
    this.dataBanner = {
      width: this.containerBanner.getAttribute('data-w'),
      height: this.containerBanner.getAttribute('data-h'),
      bgColor: this.containerBanner.getAttribute('data-bg-color'),
      border: this.containerBanner.getAttribute('data-border'),
      preload: this.containerBanner.getAttribute('data-preload'),
      cover: this.containerBanner.getAttribute('data-cover')
    }

    /* SET MAIN STYLES */

    this.containerBanner.style.width = this.dataBanner.width + 'px';
    this.containerBanner.style.height = this.dataBanner.height + 'px';
    this.containerBanner.style.backgroundColor = this.dataBanner.bgColor;
    this.containerBanner.style.border = this.dataBanner.border;

    /* SET COVER */

    if(this.dataBanner.cover == "true") {
      var divCover = document.createElement('div');
      divCover.style.backgroundColor = this.dataBanner.bgColor;
      divCover.style.zIndex = 2;
      divCover.setAttribute('id','cover');
      this.containerBanner.appendChild(divCover);
    }

    /* SET FRAMES */

    var totalFrames = 0;
    var arrayIdFrames = [];

    for(var items in this.frameData){
      this.arrayElements.push(this.frameData[items]);
      arrayIdFrames.push(items.toString());
      totalFrames++;
    };

    for (var i = 0; i < totalFrames; i++) {
      this.totalImg += this.arrayElements[i].length;
    };

    for (var ii = 0; ii < totalFrames; ii++) {
      var divTemp = document.createElement('div');
      divTemp.classList.add('frame');
      divTemp.setAttribute('id',arrayIdFrames[ii]);
      this.containerBanner.appendChild(divTemp);
      this.arrayFrames.push(divTemp);

      this.setImgs(this.arrayFrames[ii],this.arrayElements[ii]);
    };

    /* CALL SETTING CLICKTAG FUNCTION */

    this.setClickTag();
  };

  Banner.prototype.setImgs = function(frameSelected,elementsSelected){
    elementsSelected.forEach(function(i){
      var imgTemp = new Image();
      imgTemp.src = Banner.scope.imgPath + i;
      frameSelected.appendChild(imgTemp);
      var pointerCut = i.indexOf(".");
      var stringSelected = i.substr(0,pointerCut);
      imgTemp.setAttribute('id',stringSelected);
      imgTemp.onload = Banner.scope.imgLoaded();
    });
  };

  Banner.prototype.imgLoaded = function(){
    Banner.scope.counterImg++;
    if(Banner.scope.counterImg == Banner.scope.totalImg) Banner.scope.createTimeLine();
  };

  Banner.prototype.createTimeLine = function(){

    /* CREATE TIMELINE */

    Banner.scope.tl = new TimelineMax();
    Banner.scope.tl.paused(true);

    /* SET TIMELINE */

    Banner.scope.timelineData.arrayTween.forEach(function(i){
      Banner.scope.numTween++;
      Banner.scope.tl.addLabel('step_' + Banner.scope.numTween);
      switch(i.type){
        case 'set':
          Banner.scope.tl.add(TweenMax.set(i.id, i.prop),i.delay);
        break;
        case 'to':
          Banner.scope.tl.add(TweenMax.to(i.id, i.time, i.prop),i.delay);
        break;
        case 'from':
          Banner.scope.tl.add(TweenMax.from(i.id, i.time, i.prop),i.delay);
        break;
        case 'fromTo':
          Banner.scope.tl.add(TweenMax.fromTo(i.id, i.time, i.propInit, i.propEnd),i.delay);
        break;
      }
    });

    Banner.scope.tl.addCallback(
      function(){Banner.scope.endTimeLine(Banner.scope.timelineData.loopIteration, Banner.scope.timelineData.loopLabelInit)}
    );

    if(Banner.scope.timelineData.initLabel == undefined || Banner.scope.timelineData.initLabel == false) Banner.scope.tl.resume(0);
    else Banner.scope.tl.resume(Banner.scope.timelineData.initLabel);

    if(Banner.scope.timelineData.addPauseAt != undefined) Banner.scope.addPauseAt(Banner.scope.timelineData.addPauseAt);
  };

  Banner.prototype.endTimeLine = function(numRepeat, label){
    if(numRepeat == 1) return;
    else if(numRepeat == -1 || numRepeat == undefined) Banner.scope.tl.resume(0);
    else{
      Banner.scope.iteration++;
      if(numRepeat > 1 && Banner.scope.iteration == numRepeat - 1) {
        var lastLabel;
        if(Banner.scope.timelineData.loopLabelEnd == undefined || Banner.scope.timelineData.loopLabelEnd == false) {
          lastLabel = Banner.scope.tl.getLabelsArray()[Banner.scope.tl.getLabelsArray().length-1];
          Banner.scope.lastLabelName = lastLabel.name;
        } else {
          lastLabel = Banner.scope.timelineData.loopLabelEnd;
          Banner.scope.lastLabelName = lastLabel;
        }
        Banner.scope.tl.addPause(Banner.scope.lastLabelName);
      }
      if(Banner.scope.iteration == numRepeat) return;
    }
    label != undefined || label == false ? Banner.scope.tl.resume(label) : Banner.scope.tl.resume(0);
  };

  Banner.prototype.addPauseAt = function(labelOrSecond){
    Banner.scope.tl.addPause(labelOrSecond);
  };

  /* SET CLICKTAG */

  Banner.prototype.setClickTag = function(){
    this.clicktag = document.createElement('div');
    this.clicktag.setAttribute('id','clicktag');
    this.clicktag.style.position = "absolute";
    this.clicktag.style.width = this.containerBanner.style.width;
    this.clicktag.style.height = this.containerBanner.style.height;
    this.clicktag.style.opacity = 0;
    this.clicktag.style.cursor = 'pointer';
    this.clicktag.style.zIndex = 1;
    this.containerBanner.appendChild(this.clicktag);

    this.clicktag.addEventListener('click', Banner.scope.goClickTag);
  }

  Banner.prototype.goClickTag = function(){
    Banner.scope.clicktagFunction();
  }

  return Banner;
})();





