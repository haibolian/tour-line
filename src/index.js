// 创建停止按钮
function createStopBtn(clickEvent){
  const stopBtn = document.createElement('div')
  stopBtn.className = 'lead-stop-btn'
  stopBtn.innerHTML = '跳过引导'
  stopBtn.addEventListener('click', function(){
    clickEvent()
  })
  document.body.appendChild(stopBtn)
  return stopBtn
}

// 设置蒙层
function setMask(){
  const mask = document.createElement('div')
  mask.className = 'lead-mask'
  document.body.appendChild(mask)
  return mask
}

function setCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  canvas.className = 'lead-canvas'
  document.body.appendChild(canvas)
  return canvas
}

function drawLine(canvas, startRect, endRect) {
  console.log(startRect);
  console.log(endRect);
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  const radius = 5
  // 画个圆圈
  ctx.beginPath()
  ctx.arc(startRect.right + radius, startRect.top + (startRect.height / 2), radius, 0, 2*Math.PI)
  ctx.stroke();
  // 画虚线
  ctx.beginPath()  
  ctx.setLineDash([5, 5]);
  ctx.moveTo(startRect.right + radius * 2, startRect.top + (startRect.height / 2));
  ctx.lineTo(endRect.right - (endRect.width / 2), startRect.top + startRect.height / 2);
  ctx.lineTo(endRect.right - (endRect.width / 2), endRect.top - radius * 2);
  ctx.stroke()
  // 画圆圈
  ctx.beginPath()  
  ctx.setLineDash([])
  ctx.arc(endRect.right - (endRect.width / 2), endRect.top - radius, radius, 0, 2*Math.PI)
  ctx.stroke();
}

function createNextEle(){
  const nextStep = document.createElement('div')
  nextStep.className = 'lead-next-btn'
  return nextStep
}

export default function lead (options){
  const mask = setMask();
  const canvas = setCanvas()
  let nextStep = null
  const stopBtn = createStopBtn(destroy)
  
  let currentStep = 0;
  const { steps } = options
  function handleStep() {
    const step = steps[currentStep]
    const doms = step.map(elementOption => {
      const dom = document.querySelector(elementOption.element);
      dom.style.position = 'relative';
      dom.style.zIndex = '3007';
      // dom.style.border = '2px solid #fff';
      return dom
    })
    doms.reduce((prev,curr) => {
      drawLine(canvas, prev.getBoundingClientRect(), curr.getBoundingClientRect())
      // 设置下一步元素
      setNextEle(prev, curr)
    })
  }
  function setNextEle(prev, curr){
    nextStep = createNextEle()
    // 创建下一步element
    nextStep.innerHTML = `下一步(${currentStep + 1}/${steps.length})`;
    nextStep.style.top = curr.getBoundingClientRect().bottom + 20 + 'px';
    nextStep.style.left = curr.getBoundingClientRect().left + curr.getBoundingClientRect().width / 2 - 50 + 'px';
    nextStep.addEventListener('click', handleNext)
    function handleNext(e) {
      if(currentStep < steps.length - 1){
        currentStep++
        // 擦除canvas画的线
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // 清除prev,curr的高亮样式
        prev.style.zIndex = 0;
        curr.style.zIndex = 0;
        nextStep.remove()
        handleStep()
      }else{
        destroy()
      }
    }
    document.body.appendChild(nextStep)
  }

  // 销毁lead
  function destroy(){
    mask.remove();
    canvas.remove();
    nextStep.remove();
    stopBtn.remove()
  }

  handleStep()
}

