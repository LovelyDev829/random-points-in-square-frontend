import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import BigNumber from "bignumber.js";
import axios from 'axios';
import { GoogleLogout } from 'react-google-login';

import { MAX_NUM, CLIENT_ID, BASE_URL } from '../utils/Constants'

import { ReactComponent as UpIcon } from "../assets/svgs/up.svg";
import { ReactComponent as DownIcon } from "../assets/svgs/down.svg";
import { ReactComponent as PlayIcon } from "../assets/svgs/play.svg";
import { ReactComponent as LinkIcon } from "../assets/svgs/link.svg";
import { ReactComponent as FacebookIcon } from "../assets/svgs/facebook.svg";
import { ReactComponent as TrashIcon } from "../assets/svgs/trash.svg";
import { ReactComponent as RefreshIcon } from "../assets/svgs/refresh.svg";
// import { ReactComponent as ToggleLeftIcon } from "../assets/svgs/toggle-left.svg";
// import { ReactComponent as ToggleRightIcon } from "../assets/svgs/toggle-right.svg";
import html2canvas from "html2canvas";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function MainPage({ loginFlag, setLoginFlag, userInfo, setUserInfo, adminFlag }) {
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
    const [jumpFlag, setJumpFlag] = useState(true)
    const bottomRef = useRef(null);
    const topRef = useRef(null);
    const exportRef = useRef();
    const [overwriteModalFlag, setOverwriteModalFlag] = useState(false)
    const [overwriteFrameObject, setOverwriteFrameObject] = useState({})
    const [deleteModalFlag, setDeleteModalFlag] = useState(false)
    const [deleteFrameId, setDeleteFrameId] = useState('')

    useEffect(() => {
        if (!loginFlag || !userInfo?.userName) {
            setLoginFlag(false)
            navigate('/login');
        }
    })
    const jumpToReleventDiv = () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const goto = urlParams.get('goto')
        /////////////----Scroll to an element----////////////
        // const id = "saved-item-" + goto
        // const yOffset = -60;
        // const element = document.getElementById(id);
        // const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        // window.scrollTo({ top: y, behavior: 'smooth' });
        /////////////////////////////////////////////////////
        if (goto && savedData[goto]) {
            setCurrentFrame(new BigNumber(savedData[goto]?.frame))
            setInputValue(new BigNumber(savedData[goto]?.frame))
            setFps(new BigNumber(savedData[goto]?.frameFps))
            setShutterFps(savedData[goto]?.shutterFps)
            setFrequency(new BigNumber(savedData[goto]?.frequency))
        }
        // setComment(savedData[goto].comment)
        if (savedData) setJumpFlag(false)
    }
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
            axios.get(BASE_URL + '/frame/all-frames')
                .then(res => {
                    setSavedData(res.data)
                    if (jumpFlag) jumpToReleventDiv()
                })
                .catch((error) => { });
        }
        return () => {
            clearInterval(interval);
        };
    }, [currentFrame, timerFlag, totalFrame, fps, shutterFps, frequency, savedData, BASE_URL]);
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
    const digits_only = (string) => { return /^\d+$/.test(string) };
    const exportAsImage = async (element, imageFileName, downloadFlag) => {
        const canvas = await html2canvas(element);
        const image = canvas.toDataURL("image/png", 1.0);
        if (downloadFlag) downloadImage(image, imageFileName);
        // console.log("image", image)
        return image;
    };
    const downloadImage = (blob, fileName) => {
        const fakeLink = window.document.createElement("a");
        fakeLink.style = "display:none;";
        fakeLink.download = fileName;
        fakeLink.href = blob;

        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);

        fakeLink.remove();
    };
    return (
        <div className={drawFlag ? 'MainPage curser' : 'MainPage'} onMouseUp={() => { setMouseDownFlag(false); }} ref={topRef}>
            <Modal
                open={overwriteModalFlag}
                onClose={() => setOverwriteModalFlag(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure to Overwrite the animation?
                    </Typography>
                    <Grid display="flex" justifyContent="flex-end" sx={{ pt: 2 }}>
                        <Button variant="outlined" sx={{ mr: 2, pr: 4, pl: 4 }} onClick={() => {
                            axios.post(BASE_URL + '/frame/update-frame', overwriteFrameObject)
                                .then(res => {
                                    if (res.data?.success) {
                                        setComment('')
                                    }
                                    else {
                                        alert('Already existing pattern...')
                                    }
                                })
                                .catch((error) => { alert("There was an error...") });
                            setOverwriteModalFlag(false)
                        }}>Sure</Button>
                        <Button variant="contained" sx={{ pr: 4, pl: 4 }} onClick={() => setOverwriteModalFlag(false)}>Cancel</Button>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={deleteModalFlag}
                onClose={() => setDeleteModalFlag(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure to Delete the animation?
                    </Typography>
                    <Grid display="flex" justifyContent="flex-end" sx={{ pt: 2 }}>
                        <Button variant="outlined" sx={{ mr: 2, pr: 4, pl: 4 }} onClick={() => {
                            axios.delete(BASE_URL + '/frame/delete-frame/' + deleteFrameId)
                                .then(res => {
                                    if (res.data?.success) { }
                                    else { alert("There was an error...") }
                                })
                                .catch((error) => { alert("There was an error...") });
                            setDeleteModalFlag(false)
                        }}>Sure</Button>
                        <Button variant="contained" sx={{ pr: 4, pl: 4 }} onClick={() => setDeleteModalFlag(false)}>Cancel</Button>
                    </Grid>
                </Box>
            </Modal>
            <div className='header'>
                <div className='user-name'>Hi, {userInfo?.userName}</div>
                <p>THE GOD PROJECT</p>
                <div className='button' onClick={() => {
                    setLoginFlag(false)
                    setUserInfo({})
                    navigate('/login')
                }}>Log out
                    {/* <GoogleLogout
                        CLIENT_ID={CLIENT_ID}
                        buttonText="Logout"
                    ></GoogleLogout> */}
                </div>
            </div>
            <div className={drawFlag ? 'button draw-mode' : 'button draw-mode disabled'} onClick={() => {
                setDrawFlag(!drawFlag)
            }}>DRAW MODE</div>
            <div className={drawFlag ? 'button clear' : 'button clear disabled'} onClick={() => {
                if (drawFlag) setCurrentFrame(totalFrame)
            }}>CLEAR</div>
            <div className='button donate' onClick={() => {
                window.open('https://www.paypal.com/donate/?hosted_button_id=MA5J22S8PQQ24')
            }}>DONATE</div>
            <div ref={exportRef} className='squares' onMouseDown={() => { setMouseDownFlag(true); }}
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
                <input type={'checkbox'} defaultChecked={revertCheckFlag} onChange={(e) => {
                    setRevertCheckFalg(!revertCheckFlag)
                }} />
                <p>Revert on Param change |</p>
                <div className='current-frame'>Current Frame : {currentFrame.toFixed()}</div>
            </div>
            <div className='go-to-frame'>
                <p>Go To Frame</p>
                <textarea type={'text'} min={1} value={inputValue.toFixed()} onChange={(e) => {
                    e.target.style.height = `${e.target.scrollHeight}px`;
                    if (digits_only(e.target.value)) setInputValue(new BigNumber(e.target.value))
                }} />
                <div className='button' onClick={() => { setCurrentFrame(inputValue) }}>Go</div>
            </div>
            <div className='sliders'>
                <div className='slider-box'>
                    <Slider step={1} min={0} max={MAX_NUM} value={parseInt(fps.dividedBy(totalFrame).multipliedBy(MAX_NUM).toFixed())} onChange={(e) => {
                        setFps(totalFrame.minus(1).dividedBy(MAX_NUM).multipliedBy(e.target.value).integerValue(BigNumber.ROUND_CEIL).plus(1))
                        if (revertCheckFlag) setCurrentFrame(inputValue)
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
                                if (revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                            <DownIcon onClick={() => {
                                var tempFps = fps.minus(1)
                                if (tempFps.comparedTo(1) === -1) tempFps = totalFrame
                                setFps(tempFps)
                                if (revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                        </div>
                    </div>
                </div>
                <div className='slider-box'>
                    <Slider value={shutterFps} onChange={(e) => {
                        var tempValue = e.target.value
                        setShutterFps(tempValue)
                        if (fps.comparedTo(tempValue) === -1) setFps(new BigNumber(tempValue))
                        if (revertCheckFlag) setCurrentFrame(inputValue)
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
                        if (revertCheckFlag) setCurrentFrame(inputValue)
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
                                if (revertCheckFlag) setCurrentFrame(inputValue)
                            }} />
                            <DownIcon onClick={() => {
                                var tempFrequency = frequency.minus(1)
                                if (tempFrequency.comparedTo(1) === -1) tempFrequency = totalFrame
                                setFrequency(tempFrequency)
                                if (revertCheckFlag) setCurrentFrame(inputValue)
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
                            userId: userInfo?._id,
                            userName: userInfo?.userName,
                            frameFps: fps.toFixed(),
                            shutterFps: shutterFps,
                            frequency: frequency.toFixed(),
                            // imageUrl: exportAsImage(exportRef.current, "saving-image", false)
                        };
                        // downloadImage()
                        axios.post(BASE_URL + '/frame/create-frame', frameObject)
                            .then(res => {
                                if (res.data?.success) {
                                    setComment('')
                                    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    ////////////////////////////////////////////////////////////////////
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
                            <div className='saved-item' key={"saved-item-" + savedIndex} id={"saved-item-" + savedIndex}>
                                <div className='row'>
                                    <div className='squares' id={'saved-item-pattern-' + savedIndex}>
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
                                <div className='row'>
                                    <p> {savedItem?.commentDateTime} {savedItem?.userName} </p>
                                    <div className='svg-icons'>
                                        <div className='svg-icon-container'>
                                            <PlayIcon className='svg-icon' onClick={() => {
                                                setCurrentFrame(dispFrame.plus(1))
                                                setInputValue(dispFrame.plus(1))
                                                setFps(new BigNumber(savedItem?.frameFps))
                                                setShutterFps(savedItem?.shutterFps)
                                                setFrequency(new BigNumber(savedItem?.frequency))
                                                setComment(savedItem.comment)
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }} onMouseOver={() => {
                                                const tempElement = document.getElementById('tryit-btn-' + savedIndex);
                                                tempElement.className = 'hover-up'
                                            }} onMouseLeave={() => {
                                                const tempElement = document.getElementById('tryit-btn-' + savedIndex);
                                                tempElement.className = 'hidden'
                                            }} />
                                            <div id={'tryit-btn-' + savedIndex} className='hidden'>Try it</div>
                                        </div>
                                        <div className='svg-icon-container'>
                                            <RefreshIcon className={(userInfo?._id === savedItem.userId || adminFlag) ? 'svg-icon' : 'hidden'} onClick={() => {
                                                if (comment === '') {
                                                    alert('Please leave a comment...')
                                                    return
                                                }
                                                setOverwriteModalFlag(true)
                                                setOverwriteFrameObject({
                                                    frameId: savedItem._id,
                                                    frame: currentFrame.toFixed(),
                                                    comment: comment,
                                                    frameFps: fps.toFixed(),
                                                    shutterFps: shutterFps,
                                                    frequency: frequency.toFixed()
                                                })
                                            }} onMouseOver={() => {
                                                const tempElement = document.getElementById('update-btn-' + savedIndex);
                                                tempElement.className = 'hover-up'
                                            }} onMouseLeave={() => {
                                                const tempElement = document.getElementById('update-btn-' + savedIndex);
                                                tempElement.className = 'hidden'
                                            }} />
                                            <div id={'update-btn-' + savedIndex} className='hidden'>Overwrite</div>
                                        </div>
                                        <div className='svg-icon-container'>
                                            <TrashIcon className={(userInfo?._id === savedItem?.userId || adminFlag) ? 'svg-icon' : 'hidden'} onClick={() => {
                                                setDeleteModalFlag(true)
                                                setDeleteFrameId(savedItem._id)
                                            }} onMouseOver={() => {
                                                const tempElement = document.getElementById('delete-btn-' + savedIndex);
                                                tempElement.className = 'hover-up'
                                            }} onMouseLeave={() => {
                                                const tempElement = document.getElementById('delete-btn-' + savedIndex);
                                                tempElement.className = 'hidden'
                                            }} />
                                            <div id={'delete-btn-' + savedIndex} className='hidden'>Delete</div>
                                        </div>
                                        <div className='svg-icon-container'>
                                            <FacebookIcon className='svg-icon' onClick={async() => {
                                                // exportAsImage(document.getElementById('saved-item-pattern-' + savedIndex), "saving-image", true)
                                                // window.open(`https://www.facebook.com/sharer/sharer.php?u=https://the-god-project.com/main?goto=${savedIndex}`)
                                                const imageUrl = await exportAsImage(document.getElementById('saved-item-pattern-' + savedIndex), "saving-image", false)
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=https://the-god-project.com/main?goto=${savedIndex}&picture=${imageUrl}&title=${'The God Project Pattern Animation'}`)
                                            }} onMouseOver={() => {
                                                const tempElement = document.getElementById('facebook-btn-' + savedIndex);
                                                tempElement.className = 'hover-up'
                                            }} onMouseLeave={() => {
                                                const tempElement = document.getElementById('facebook-btn-' + savedIndex);
                                                tempElement.className = 'hidden'
                                            }} />
                                            <div id={'facebook-btn-' + savedIndex} className='hidden'>Share to Facebook</div>
                                        </div>
                                        <div className='svg-icon-container'>
                                            <LinkIcon className='svg-icon' onClick={() => {
                                                exportAsImage(document.getElementById('saved-item-pattern-' + savedIndex), "saving-image", true)
                                                navigator.clipboard.writeText(`https://the-god-project.com/main?goto=${savedIndex}`)
                                                alert(`Link was copied to the clipboard: https://the-god-project.com/main?goto=${savedIndex}`)
                                            }} onMouseOver={() => {
                                                const tempElement = document.getElementById('link-btn-' + savedIndex);
                                                tempElement.className = 'hover-up'
                                            }} onMouseLeave={() => {
                                                const tempElement = document.getElementById('link-btn-' + savedIndex);
                                                tempElement.className = 'hidden'
                                            }} />
                                            <div id={'link-btn-' + savedIndex} className='hidden'>Copy Link</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div ref={bottomRef} style={{ height: "200px" }} />
        </div>
    )
}

export default MainPage