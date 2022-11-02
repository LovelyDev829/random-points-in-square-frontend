import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import BigNumber from "bignumber.js";
import axios from 'axios';
// import { ReactComponent as LeftIcon } from "../assets/left.svg";
// import { ReactComponent as RightIcon } from "../assets/right.svg";
import { ReactComponent as UpIcon } from "../assets/up.svg";
import { ReactComponent as DownIcon } from "../assets/down.svg";
// import { ReactComponent as LeftLeftIcon } from "../assets/left-left.svg";
// import { ReactComponent as RightRightIcon } from "../assets/right-right.svg";
// import { ReactComponent as UpUpIcon } from "../assets/up-up.svg";
// import { ReactComponent as DownDownIcon } from "../assets/down-down.svg";
// import { ReactComponent as ToggleLeftIcon } from "../assets/toggle-left.svg";
// import { ReactComponent as ToggleRightIcon } from "../assets/toggle-right.svg";

const MAX_NUM = Number.MAX_SAFE_INTEGER

function MainPage({ loginFlag, setLoginFlag, userInfo, setUserInfo, baseUrl, adminFlag }) {
    const cellA = [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0]
    const cellB = [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0]
    const cellD = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0]
    const cellC = [0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0]
    const unitNumber = 8
    const totalFrame = new BigNumber(16).pow(unitNumber * unitNumber);
    const [currentFrame, setCurrentFrame] = useState(new BigNumber(1))
    const [timerFlag, setTimerFlag] = useState(false)
    const [inputValue, setInputValue] = useState(new BigNumber(1))
    const [fps, setFps] = useState(new BigNumber(100))
    const [shutterFps, setShutterFps] = useState(50)
    const [frequency, setFrequency] = useState(new BigNumber(1))
    const [forwardFlag, setForwardFlag] = useState(false)
    const [backwardFlag, setBackwardFlag] = useState(false)
    const [stepForwardFlag, setStepForwardFlag] = useState(false)
    const [stepBackwardFlag, setStepBackwardFlag] = useState(false)
    const [drawFlag, setDrawFlag] = useState(false)
    const [comment, setComment] = useState('')
    const [savedData, setSavedData] = useState([])
    const navigate = useNavigate();
    const [mouseDownFlag, setMouseDownFlag] = useState(false)
    const [revertCheckFlag, setRevertCheckFalg] = useState(false)
    useEffect(() => {
        if (!loginFlag || !userInfo.userName) {
            setLoginFlag(false)
            navigate('/login');
        }
    })
    useEffect(() => {
        var interval
        if (timerFlag) {
            interval = setInterval(() => {
                var times = fps.dividedToIntegerBy(shutterFps)
                var tempTotalFrame = currentFrame.minus(1).plus(frequency.multipliedBy(times))
                var multipleValue = tempTotalFrame.dividedToIntegerBy(totalFrame)
                var tempCurrentFrame = tempTotalFrame.minus(totalFrame.multipliedBy(multipleValue))
                setCurrentFrame(tempCurrentFrame.plus(1))
            }, (1000 / shutterFps));
        }
        else {
            clearInterval(interval);
            axios.get(baseUrl + '/frame/all-frames')
                .then(res => {
                    setSavedData(res.data)
                })
                .catch((error) => { });
        }
        return () => {
            clearInterval(interval);
        };
    }, [currentFrame, timerFlag, totalFrame, fps, shutterFps, frequency, savedData, baseUrl]);
    useEffect(() => {
        var timer, tempCurrentFrame
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
                if (tempCurrentFrame.comparedTo(1) === -1) setCurrentFrame(tempCurrentFrame.plus(totalFrame))
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
                if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(new BigNumber(1))
                else setCurrentFrame(tempCurrentFrame)
            }, 100)
        }
        else if (stepBackwardFlag) {
            timer = setTimeout(() => {
                tempCurrentFrame = currentFrame.minus(1)
                if (tempCurrentFrame.comparedTo(1) === -1) setCurrentFrame(totalFrame)
                else setCurrentFrame(tempCurrentFrame)
            }, 100)
        }
        else clearTimeout(timer)
        return () => clearTimeout(timer)
    })

    const squareClickedHadle = (sixteenNumber, tempIndex, currentCell) => {
        const chIndex = (unitNumber * unitNumber) - currentCell
        var newSixteenNumber = sixteenNumber;
        const round = (unitNumber * unitNumber) - sixteenNumber.length;
        [...Array(round)].forEach(() => { newSixteenNumber = '0' + newSixteenNumber })
        newSixteenNumber = newSixteenNumber.substring(0, chIndex) + tempIndex.toString(16) + newSixteenNumber.substring(chIndex + 1)
        const newCurrentFrame = new BigNumber(newSixteenNumber, 16).plus(1)
        setCurrentFrame(newCurrentFrame)
    }
    const digits_only = (string) => { return /^\d+$/.test(string)};
    return (
        <div className={drawFlag ? 'MainPage curser' : 'MainPage'} onMouseUp={() => { setMouseDownFlag(false); }}>
            <div className='header'>
                <div className='user-name'>Hi, {userInfo.userName}</div>
                <p>THE GOD PROJECT</p>
                <div className='button' onClick={() => {
                    setLoginFlag(false)
                    setUserInfo({})
                    navigate('/login')
                }}>logout</div>
            </div>
            <div className={drawFlag ? 'button draw-mode' : 'button draw-mode disabled'} onClick={() => {
                setDrawFlag(!drawFlag)
            }}>DRAW MODE</div>
            <div className={drawFlag ? 'button clear' : 'button clear disabled'} onClick={() => {
                if (drawFlag) setCurrentFrame(totalFrame)
            }}>CLEAR</div>
            <div className='squares' onMouseDown={() => { setMouseDownFlag(true); }}
                onMouseLeave={() => { setMouseDownFlag(false); }}
                onMouseUp={() => { setMouseDownFlag(false); }}>
                {
                    [...Array(unitNumber)].map((item, firstIndex) => {
                        var sixteenNumber = currentFrame.minus(1).toString(16)
                        return (
                            <div className='row' key={"first" + firstIndex}>
                                {
                                    [...Array(unitNumber)].map((item, secondIndex) => {
                                        const currentCell = (unitNumber * unitNumber) - parseInt(firstIndex.toString() + secondIndex.toString(), unitNumber)
                                        const index = parseInt(sixteenNumber[sixteenNumber.length - currentCell], 16) || 0
                                        return (
                                            <div className='unit-squares' key={"first" + secondIndex}>
                                                <div className='row'>
                                                    <div className={cellA[index] === 1 ? 'square black' : 'square'} onMouseOver={() => {
                                                        if (!drawFlag || !mouseDownFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] !== cellA[tempIndex] && cellB[index] === cellB[tempIndex]
                                                                && cellC[index] === cellC[tempIndex] && cellD[index] === cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }} onMouseDown={() => {
                                                        if (!drawFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] !== cellA[tempIndex] && cellB[index] === cellB[tempIndex]
                                                                && cellC[index] === cellC[tempIndex] && cellD[index] === cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }}></div>
                                                    <div className={cellB[index] === 1 ? 'square black' : 'square'} onMouseOver={() => {
                                                        if (!drawFlag || !mouseDownFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] === cellA[tempIndex] && cellB[index] !== cellB[tempIndex]
                                                                && cellC[index] === cellC[tempIndex] && cellD[index] === cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }} onMouseDown={() => {
                                                        if (!drawFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] === cellA[tempIndex] && cellB[index] !== cellB[tempIndex]
                                                                && cellC[index] === cellC[tempIndex] && cellD[index] === cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }}></div>
                                                </div>
                                                <div className='row'>
                                                    <div className={cellC[index] === 1 ? 'square black' : 'square'} onMouseOver={() => {
                                                        if (!drawFlag || !mouseDownFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] === cellA[tempIndex] && cellB[index] === cellB[tempIndex]
                                                                && cellC[index] !== cellC[tempIndex] && cellD[index] === cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }} onMouseDown={() => {
                                                        if (!drawFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] === cellA[tempIndex] && cellB[index] === cellB[tempIndex]
                                                                && cellC[index] !== cellC[tempIndex] && cellD[index] === cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }}></div>
                                                    <div className={cellD[index] === 1 ? 'square black' : 'square'} onMouseOver={() => {
                                                        if (!drawFlag || !mouseDownFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] === cellA[tempIndex] && cellB[index] === cellB[tempIndex]
                                                                && cellC[index] === cellC[tempIndex] && cellD[index] !== cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }} onMouseDown={() => {
                                                        if (!drawFlag) return;
                                                        [...Array(unitNumber * unitNumber)].forEach((item, tempIndex) => {
                                                            if (cellA[index] === cellA[tempIndex] && cellB[index] === cellB[tempIndex]
                                                                && cellC[index] === cellC[tempIndex] && cellD[index] !== cellD[tempIndex]) {
                                                                squareClickedHadle(sixteenNumber, tempIndex, currentCell)
                                                            }
                                                        })
                                                    }}></div>
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
                <div className='button' onClick={() => { setTimerFlag(false) }}>Pause</div>
                <div className='button' onClick={() => { setCurrentFrame(new BigNumber(1)); }}>Reset</div>
            </div>
            <div className='total-frame'>Total Frame : {totalFrame.toFixed()}</div>
            <div className='slider'>
                <div className='button' onMouseDown={() => setBackwardFlag(true)} onClick={() => {
                    var tempCurrentFrame = currentFrame.minus(frequency)
                    if (tempCurrentFrame.comparedTo(1) === -1) setCurrentFrame(tempCurrentFrame.plus(totalFrame))
                    else setCurrentFrame(tempCurrentFrame)
                }}
                    onMouseLeave={() => setBackwardFlag(false)} onMouseUp={() => setBackwardFlag(false)}>{'<<<'}</div>
                <div className='button left' onMouseDown={() => setStepBackwardFlag(true)}
                    onMouseLeave={() => setStepBackwardFlag(false)} onMouseUp={() => setStepBackwardFlag(false)}
                    onClick={() => {
                        var tempCurrentFrame = currentFrame.minus(1)
                        if (tempCurrentFrame.comparedTo(1) === -1) setCurrentFrame(totalFrame)
                        else setCurrentFrame(tempCurrentFrame)
                    }}>{'<'}</div>
                <Slider step={0.01} min={0} max={MAX_NUM} value={parseInt(currentFrame.dividedBy(totalFrame).multipliedBy(MAX_NUM).toFixed())} onChange={(e) => {
                    setCurrentFrame(totalFrame.minus(1).dividedBy(MAX_NUM).multipliedBy(e.target.value).integerValue(BigNumber.ROUND_CEIL).plus(1))
                }} />
                <div className='button right' onMouseDown={() => setStepForwardFlag(true)}
                    onMouseLeave={() => setStepForwardFlag(false)} onMouseUp={() => setStepForwardFlag(false)}
                    onClick={() => {
                        var tempCurrentFrame = currentFrame.plus(1)
                        if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(new BigNumber(1))
                        else setCurrentFrame(tempCurrentFrame)
                    }}>{'>'}</div>
                <div className='button' onMouseDown={() => setForwardFlag(true)} onClick={() => {
                    var tempCurrentFrame = currentFrame.plus(frequency)
                    if (tempCurrentFrame.comparedTo(totalFrame) === 1) setCurrentFrame(tempCurrentFrame.minus(totalFrame))
                    else setCurrentFrame(tempCurrentFrame)
                }}
                    onMouseLeave={() => setForwardFlag(false)} onMouseUp={() => setForwardFlag(false)}>{'>>>'}</div>
            </div>
            <div className='row-center'>
                <input type={'checkbox'} defaultChecked={revertCheckFlag} onChange={(e)=>{
                    setRevertCheckFalg(!revertCheckFlag)
                }}/>
                <p>Revert on Param change |</p>
                <div className='current-frame'>Current Frame : {currentFrame.toFixed()}</div>
            </div>
            <div className='go-to-frame'>
                <p>Go To Frame</p>
                <textarea type={'text'} min={1} value={inputValue.toFixed()} onChange={(e) => {
                    console.log(e.target.scrollHeight)
                    e.target.style.height = `${e.target.scrollHeight}px`;
                    if (digits_only(e.target.value)) setInputValue(new BigNumber(e.target.value))
                }} />
                <div className='button' onClick={() => { setCurrentFrame(inputValue) }}>Go</div>
            </div>
            <div className='sliders'>
                <div className='slider-box'>
                    <Slider step={1} min={0} max={MAX_NUM} value={parseInt(fps.dividedBy(totalFrame).multipliedBy(MAX_NUM).toFixed())} onChange={(e) => {
                        setFps(totalFrame.minus(1).dividedBy(MAX_NUM).multipliedBy(e.target.value).integerValue(BigNumber.ROUND_CEIL).plus(1))
                        if(revertCheckFlag) setCurrentFrame(inputValue)
                    }} />
                    <div className='row'>
                        <p>Frame Speed FPS : </p>
                        <textarea type={'text'} value={fps.toFixed()} onChange={(e) => {
                            e.target.style.height = `${e.target.scrollHeight}px`;
                            if (digits_only(e.target.value)) setFps(new BigNumber(e.target.value))
                        }} />
                        <div className='nano-buttons'>
                            <UpIcon onClick={() => {
                                var tempFps = fps.plus(1)
                                if (tempFps.comparedTo(totalFrame) === 1) tempFps = new BigNumber(1)
                                setFps(tempFps)
                                if(revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                            <DownIcon onClick={() => {
                                var tempFps = fps.minus(1)
                                if (tempFps.comparedTo(1) === -1) tempFps = totalFrame
                                setFps(tempFps)
                                if(revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                        </div>
                    </div>
                </div>
                <div className='slider-box'>
                    <Slider value={shutterFps} onChange={(e) => {
                        var tempValue = e.target.value
                        setShutterFps(tempValue)
                        if (fps.comparedTo(tempValue) === -1) setFps(new BigNumber(tempValue))
                        if(revertCheckFlag) setCurrentFrame(inputValue)
                    }} step={1} min={1} max={120} />
                    <div className='row'>
                        <p>Shutter Speed FPS : </p>
                        <input type={'number'} min={1} max={120} value={shutterFps} onChange={(e) => {
                            var tempValue = e.target.value
                            setShutterFps(tempValue)
                            if (fps.comparedTo(tempValue) === -1) setFps(new BigNumber(tempValue))
                        }} />
                    </div>
                </div>
                <div className='slider-box'>
                    <Slider step={1} min={0} max={MAX_NUM} value={parseInt(frequency.dividedBy(totalFrame).multipliedBy(MAX_NUM).toFixed())} onChange={(e) => {
                        setFrequency(totalFrame.minus(1).dividedBy(MAX_NUM).multipliedBy(e.target.value).integerValue(BigNumber.ROUND_CEIL).plus(1))
                        if(revertCheckFlag) setCurrentFrame(inputValue)
                    }} />
                    <div className='row'>
                        <p>Frequency : </p>
                        <textarea type={'text'} value={frequency.toFixed()} onChange={(e) => {
                            e.target.style.height = `${e.target.scrollHeight}px`;
                            if (digits_only(e.target.value)) setFrequency(new BigNumber(e.target.value))
                        }} />
                        <div className='nano-buttons'>
                            <UpIcon onClick={() => {
                                var tempFrequency = frequency.plus(1)
                                if (tempFrequency.comparedTo(totalFrame) === 1) tempFrequency = new BigNumber(1)
                                setFrequency(tempFrequency)
                                if(revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                            <DownIcon onClick={() => {
                                var tempFrequency = frequency.minus(1)
                                if (tempFrequency.comparedTo(1) === -1) tempFrequency = totalFrame
                                setFrequency(tempFrequency)
                                if(revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='reset-all'>
                <div className='button' onClick={() => {
                    setCurrentFrame(new BigNumber(1));
                    setInputValue(new BigNumber(1));
                    setTimerFlag(false);
                    setFps(100)
                    setFrequency(new BigNumber(1))
                }}>Reset All</div>
            </div>
            <div className='saving-comment'>
                <p>please comment here.</p>
                <textarea value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <div className='buttons'>
                    <div className='button' onClick={() => setComment('')}>Clear</div>
                    <div className='button' onClick={() => {
                        // setSavedData([...savedData, { currentFrame: currentFrame, comment: comment }])
                        if (comment === '') {
                            alert('Please leave a comment...')
                            return
                        }
                        const frameObject = {
                            frame: currentFrame.toFixed(),
                            comment: comment,
                            userId: userInfo._id,
                            userName: userInfo.userName,
                            frameFps: fps.toFixed(),
                            shutterFps: shutterFps,
                            frequency: frequency.toFixed()
                        };
                        console.log(frameObject)
                        axios.post(baseUrl + '/frame/create-frame', frameObject)
                            .then(res => {
                                if (res.data?.success) {
                                    setComment('')
                                }
                                else {
                                    alert('Already existing pattern...')
                                }
                            })
                            .catch((error) => { alert("There was an error...") });
                    }}>Save</div>
                </div>
            </div>
            <div className='horizontal-line'></div>
            <div className='saved-items'>
                {
                    savedData?.map((savedItem, savedIndex) => {
                        const dispFrame = new BigNumber(savedItem?.frame).minus(1)
                        return (
                            <div className='saved-item' key={"saved-item-" + savedIndex}>
                                <div className='row'>
                                    <div className='squares'>
                                        {
                                            [...Array(unitNumber)].map((item, firstIndex) => {
                                                return (
                                                    <div className='row' key={"first" + firstIndex}>
                                                        {
                                                            [...Array(unitNumber)].map((item, secondIndex) => {
                                                                const currentCell = (unitNumber * unitNumber) - parseInt(firstIndex.toString() + secondIndex.toString(), unitNumber)
                                                                var sixteenNumber = dispFrame?.toString(16)
                                                                const index = parseInt(sixteenNumber[sixteenNumber?.length - currentCell], 16) || 0
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
                                    <div className='comment-area'>{savedItem?.comment}
                                        <p>Frame Speed Fps: {savedItem?.frameFps},
                                            Shutter Speed Fps: {savedItem?.shutterFps},
                                            Frequency: {savedItem?.frequency}</p>
                                    </div>
                                </div>
                                <div className='row'>{savedItem?.commentDateTime} {savedItem?.userName}
                                    <div className={(userInfo._id === savedItem.userId || adminFlag) ? 'button' : 'hidden'} onClick={() => {
                                        if (comment === '') {
                                            alert('Please leave a comment...')
                                            return
                                        }
                                        const frameObject = {
                                            frameId: savedItem._id,
                                            frame: currentFrame.toFixed(),
                                            comment: comment,
                                            frameFps: fps.toFixed(),
                                            shutterFps: shutterFps,
                                            frequency: frequency.toFixed()
                                        };
                                        axios.post(baseUrl + '/frame/update-frame', frameObject)
                                            .then(res => {
                                                if (res.data?.success) {
                                                    setComment('')
                                                }
                                                else {
                                                    alert('Already existing pattern...')
                                                }
                                            })
                                            .catch((error) => { alert("There was an error...") });
                                    }}>Update</div>
                                    <div className='button' onClick={() => {
                                        setCurrentFrame(dispFrame.plus(1))
                                        setInputValue(dispFrame.plus(2))
                                        setFps(new BigNumber(savedItem?.frameFps))
                                        setShutterFps(savedItem?.shutterFps)
                                        setFrequency(new BigNumber(savedItem?.frequency))
                                        setComment(savedItem.comment)
                                    }}>Try it</div>
                                    <div className={(userInfo._id === savedItem.userId || adminFlag) ? 'button' : 'hidden'} onClick={() => {
                                        axios.delete(baseUrl + '/frame/delete-frame/' + savedItem._id)
                                            .then(res => {
                                                if (res.data?.success) { }
                                                else { alert("There was an error...") }
                                            })
                                            .catch((error) => { alert("There was an error...") });
                                    }}>Delete</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default MainPage