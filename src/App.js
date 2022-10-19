import { useState, useEffect } from 'react';
import './App.scss';
import Slider from '@mui/material/Slider';

function App() {
  const cellA = [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0]
  const cellB = [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0]
  const cellD = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0]
  const cellC = [0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0]
  const temp = 2
  const totalFrame = Math.pow(16, temp * temp);
  const [currentFrame, setCurrentFrame] = useState(0)
  const [timerFlag, setTimerFlag] = useState(false)
  const [inputValue, setInputValue] = useState(1)
  useEffect(() => {
    if (timerFlag) {
      var interval = setInterval(() => {
        if (currentFrame === totalFrame + 1) setCurrentFrame(0)
        else setCurrentFrame(currentFrame + 1)
      }, 10);
    }
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [currentFrame, timerFlag]);
  return (
    <div className="App">
      <div className='squares'>
        {
          [...Array(temp)].map((item, firstIndex) => {
            return (
              <div className='row' key={"first" + firstIndex}>
                {
                  [...Array(temp)].map((item, secondIndex) => {

                    const currentCell = (temp * temp) - parseInt(firstIndex.toString() + secondIndex.toString(), 2)
                    const sixteenNumber = currentFrame.toString(16)
                    const index = parseInt(sixteenNumber[sixteenNumber.length - currentCell], 16) || 0
                    console.log(firstIndex, secondIndex, currentCell,
                      currentFrame, sixteenNumber, sixteenNumber[currentCell], parseInt(sixteenNumber[currentCell], 16) || 0)

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
        <div className='button' onClick={() => { setCurrentFrame(0); }}>Reset</div>
      </div>
      <div className='current-frame'>Total Frame : {totalFrame}</div>
      <div className='current-frame'>Current Frame : {currentFrame + 1}</div>
      <div className='go-to-frame'>
        <p>Go To Frame</p>
        <input type={'number'} max={totalFrame} value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} />
        <div className='button' onClick={() => { setCurrentFrame(inputValue) }}>Go</div>
      </div>
      <div className='slider'>
        <Slider valueLabelDisplay="auto" value={currentFrame+1} onChange={(e)=>{
          setCurrentFrame(e.target.value)
        }} step={1} min={1} max={totalFrame}/>
      </div>
      <div className='reset-all'>
        <div className='button' onClick={() => {
          setCurrentFrame(0);
          setInputValue(0);
          setTimerFlag(false);
        }}>Reset All</div>
      </div>
    </div>
  );
}

export default App;
