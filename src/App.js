import { useState, useEffect } from 'react';
import './App.scss';
import Slider from '@mui/material/Slider';
import BigNumber from "bignumber.js";
const MAX_NUM = Number.MAX_SAFE_INTEGER

function App() {
  const cellA = [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0]
  const cellB = [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0]
  const cellD = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0]
  const cellC = [0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0]
  const unitNumber = 4
  const totalFrame = new BigNumber(16).pow(unitNumber * unitNumber);
  const [currentFrame, setCurrentFrame] = useState(new BigNumber(0))
  const [displayingCurrentFrame, setDisplayingCurrentFrame] = useState(new BigNumber(0))
  const [timerFlag, setTimerFlag] = useState(false)
  const [inputValue, setInputValue] = useState('1')
  const [fps, setFps] = useState(50)
  const [shutterFps, setShutterFps] = useState(50)
  const [frequency, setFrequency] = useState(new BigNumber(1))
  const [forwardFlag, setForwardFlag] = useState(false)
  const [backwardFlag, setBackwardFlag] = useState(false)
  const [stepForwardFlag, setStepForwardFlag] = useState(false)
  const [stepBackwardFlag, setStepBackwardFlag] = useState(false)

  useEffect(() => {
    var interval
    if (timerFlag) {
      interval = setInterval(() => {
        // console.log(currentFrame.plus(frequency), totalFrame, currentFrame.comparedTo(totalFrame))
        if (currentFrame.plus(frequency).comparedTo(totalFrame) === 1) setCurrentFrame(currentFrame.plus(frequency).minus(totalFrame))
        else setCurrentFrame(currentFrame.plus(frequency))
      }, (1000 / fps));
    }
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [currentFrame, timerFlag, totalFrame, fps, frequency]);

  useEffect(() => {
    var timer, tempCurrentFrame
    // console.log(currentFrame)
    if (forwardFlag) {
      timer = setTimeout(() => {
        tempCurrentFrame = currentFrame.plus(frequency)
        if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(tempCurrentFrame.minus(totalFrame))
        else setCurrentFrame(tempCurrentFrame)
      }, 100)
    }
    else if (backwardFlag) {
      timer = setTimeout(() => {
        tempCurrentFrame = currentFrame.minus(frequency)
        if (tempCurrentFrame.comparedTo(0) === -1) setCurrentFrame(tempCurrentFrame.plus(totalFrame))
        else setCurrentFrame(tempCurrentFrame)
      }, 100)
    }
    else clearTimeout(timer)
    return () => clearTimeout(timer)
  })

  useEffect(() => {
    var timer, tempCurrentFrame
    if (stepForwardFlag) {
      timer = setTimeout(() => {
        tempCurrentFrame = currentFrame.plus(1)
        if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(new BigNumber(0))
        else setCurrentFrame(tempCurrentFrame)
      }, 100)
    }
    else if (stepBackwardFlag) {
      timer = setTimeout(() => {
        tempCurrentFrame = currentFrame.minus(1)
        if (tempCurrentFrame.comparedTo(0) === -1) setCurrentFrame(totalFrame)
        else setCurrentFrame(tempCurrentFrame)
      }, 100)
    }
    else clearTimeout(timer)
    return () => clearTimeout(timer)
  })
  return (
    <div className="App">
      <div className='squares'>
        {
          [...Array(unitNumber)].map((item, firstIndex) => {
            return (
              <div className='row' key={"first" + firstIndex}>
                {
                  [...Array(unitNumber)].map((item, secondIndex) => {

                    const currentCell = (unitNumber * unitNumber) - parseInt(firstIndex.toString() + secondIndex.toString(), unitNumber)
                    const sixteenNumber = currentFrame.toString(16)
                    // console.log(currentFrame.toFixed(), sixteenNumber)
                    const index = parseInt(sixteenNumber[sixteenNumber.length - currentCell], 16) || 0
                    return (
                      <div className='unit-squares' key={"first" + secondIndex}>
                        <div className='row'>
                          <div className={cellA[index] === 1 ? 'square black' : 'square'}></div>
                          <div className={cellB[index] === 1 ? 'square black' : 'square'}></div>
                        </div>
                        <div className='row'>
                          <div className={cellC[index] === 1 ? 'square black' : 'square'}></div>
                          <div className={cellD[index] === 1 ? 'square black' : 'square'}></div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
      <div className='buttons'>
        <div className='button' onClick={() => { setTimerFlag(true) }}>Start</div>
        <div className='button' onClick={() => { setTimerFlag(false) }}>Stop</div>
        <div className='button' onClick={() => { setCurrentFrame(new BigNumber(0)); }}>Reset</div>
      </div>
      <div className='current-frame'>Total Frame : {totalFrame.toFixed()}</div>
      <div className='sliders'>
        <div className='slider-box'>
          <Slider value={fps} onChange={(e) => { setFps(e.target.value) }} step={1} min={1} max={120} />
          <div className='row'>
            <p>Frame Speed FPS : </p>
            <input type={'number'} min={1} max={120} value={fps} onChange={(e) => { setFps(e.target.value) }} />
          </div>
        </div>
        <div className='slider-box'>
          <Slider value={shutterFps} onChange={(e) => { setShutterFps(e.target.value) }} step={1} min={1} max={120} />
          <div className='row'>
            <p>Shutter Speed FPS : </p>
            <input type={'number'} min={1} max={120} value={shutterFps} onChange={(e) => { setShutterFps(e.target.value) }} />
          </div>
        </div>
        <div className='slider-box'>
          <Slider value={parseInt(frequency.dividedBy(totalFrame).multipliedBy(MAX_NUM).toFixed())} onChange={(e) => {
            setFrequency(totalFrame.dividedBy(MAX_NUM - 1).multipliedBy(e.target.value - 1).plus(1).integerValue(BigNumber.ROUND_FLOOR))
          }} step={1} min={1} max={MAX_NUM} />
          <div className='row'>
            <p>Frequency : </p>
            <input className='long' type={'text'} value={frequency.toFixed()} onChange={(e) => { setFrequency(new BigNumber(e.target.value)) }} />
          </div>
        </div>
      </div>
      <div className='go-to-frame'>
        <p>Go To Frame</p>
        <input type={'text'} min={1} value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} />
        <div className='button' onClick={() => { setCurrentFrame(new BigNumber(inputValue).minus(1)) }}>Go</div>
      </div>
      <div className='slider'>
        <div className='button' onMouseDown={() => setBackwardFlag(true)} onClick={() => {
          var tempCurrentFrame = currentFrame.minus(frequency)
          if (tempCurrentFrame.comparedTo(0) === -1) setCurrentFrame(tempCurrentFrame.plus(totalFrame))
          else setCurrentFrame(tempCurrentFrame)
        }}
          onMouseLeave={() => setBackwardFlag(false)} onMouseUp={() => setBackwardFlag(false)}>{'<<<'}</div>

        <div className='button left' onMouseDown={() => setStepBackwardFlag(true)}
          onMouseLeave={() => setStepBackwardFlag(false)} onMouseUp={() => setStepBackwardFlag(false)}
          onClick={() => {
            var tempCurrentFrame = currentFrame.minus(1)
            if (tempCurrentFrame.comparedTo(0) === -1) setCurrentFrame(totalFrame)
            else setCurrentFrame(tempCurrentFrame)
          }}>{'<'}</div>

        <Slider step={1} min={1} max={MAX_NUM} value={parseInt(currentFrame.dividedBy(totalFrame).multipliedBy(MAX_NUM).toFixed())} onChange={(e) => {
          setCurrentFrame(totalFrame.dividedBy(MAX_NUM - 1).multipliedBy(e.target.value - 1).integerValue(BigNumber.ROUND_FLOOR))
        }} />

        <div className='button right' onMouseDown={() => setStepForwardFlag(true)}
          onMouseLeave={() => setStepForwardFlag(false)} onMouseUp={() => setStepForwardFlag(false)}
          onClick={() => {
            var tempCurrentFrame = currentFrame.plus(1)
            if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(new BigNumber(0))
            else setCurrentFrame(tempCurrentFrame)
          }}>{'>'}</div>

        <div className='button' onMouseDown={() => setForwardFlag(true)} onClick={() => {
          var tempCurrentFrame = currentFrame.plus(frequency)
          if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(tempCurrentFrame.minus(totalFrame))
          else setCurrentFrame(tempCurrentFrame)
        }}
          onMouseLeave={() => setForwardFlag(false)} onMouseUp={() => setForwardFlag(false)}>{'>>>'}</div>
      </div>
      <div className='current-frame'>Current Frame : {currentFrame.plus(1).toFixed()}</div>
      <div className='reset-all'>
        <div className='button' onClick={() => {
          setCurrentFrame(new BigNumber(0));
          setInputValue(0);
          setTimerFlag(false);
          setFps(100)
          setFrequency(1)
        }}>Reset All</div>
      </div>
    </div>
  );
}

export default App;
