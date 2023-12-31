'use client'

import { useEffect, useState, useRef } from 'react'
import * as sortingAlgorithms from '../components/sortingAlgorithms'
import Link from 'next/link';
import useSound from 'use-sound';
import Sound from '../../public/sounds/merge.mp3';

export default function Sortify() {

  const [mainArray, setMainArray] = useState([]);
  const [sortFunction, setSortFunction] = useState("bubble");
  const [maxValue, setMaxValue] = useState(Math.max(...mainArray));
  const [playSound, { stop: stopSound }] = useSound(Sound, { loop: true });
  const playSoundRef = useRef();
  const myRef = useRef(null);
  const stopSoundRef = useRef();
  const minValue = 0;
  const minFrequency = 200;
  const maxFrequency = 600;
  let audioCtx = null;
  let continueAnimation = true;

  function playNote(freq, duration) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext || webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
    const node = audioCtx.createGain();
    node.gain.value = 0.009;
    osc.connect(node);
    node.connect(audioCtx.destination);
  }

  function arrayValueToFrequency(value, minValue, maxValue, minFrequency, maxFrequency) {
    return ((value - minValue) / (maxValue - minValue)) * (maxFrequency - minFrequency) + minFrequency;
  }

  const sortArray = () => {
    switch (sortFunction) {
      case "bubble":
        bubbleSort();
        myRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case "merge":
        mergeSort();
        myRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case "insert":
        insertionSort();
        myRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case "heap":
        heapSort();
        myRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      case "quick":
        quickSort();
        myRef.current.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        console.error("Invalid sort function");
    }
  }

  const resetArray = () => {
    continueAnimation = false;
    stopSound();
    const array = [];
    for (let i = 0; i < 100; i++) {
      array.push(randomIntFromInterval(5, 1000));
    }
    setMainArray(array);

    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      const barStyle = arrayBars[i].style;
      barStyle.backgroundColor = 'white';
    }
  }

  const mergeSort = () => {
    continueAnimation = true;
    const animations = sortingAlgorithms.mergeSort(mainArray);
    const totalAnimationTime = animations.length * 10;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? 'red' : 'green';
        setTimeout(() => {
          if (continueAnimation) {
            barOneStyle.backgroundColor = color;
            barTwoStyle.backgroundColor = color;
          }
        }, i * 10);
      } else {
        setTimeout(() => {
          if (continueAnimation) {
            const [barOneIdx, newHeight] = animations[i];
            const barOneStyle = arrayBars[barOneIdx].style;
            barOneStyle.height = `${newHeight}px`;
            const freq = arrayValueToFrequency(newHeight, minValue, maxValue, minFrequency, maxFrequency);
            playNote(freq, 0.1);
          }
        }, i * 10);
      }
    }
    setTimeout(stopSoundRef.current, totalAnimationTime);
  }

  const bubbleSort = () => {
    continueAnimation = true;
    const animations = sortingAlgorithms.bubbleSort(mainArray);
    const totalAnimationTime = animations.length * 10;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 4 === 0 ? 'red' : 'green';
        setTimeout(() => {
          if (continueAnimation) {
            barOneStyle.backgroundColor = color;
            barTwoStyle.backgroundColor = color;
          }
        }, i * 10);
      } else {
        setTimeout(() => {
          if (continueAnimation) {
            const [barIdx, newHeight] = animations[i];
            const barStyle = arrayBars[barIdx].style;
            barStyle.height = `${newHeight}px`;
            const freq = arrayValueToFrequency(newHeight, minValue, maxValue, minFrequency, maxFrequency);
            playNote(freq, 0.1);
          }
        }, i * 10);
      }
    }
    setTimeout(stopSoundRef.current, totalAnimationTime);
  }

  const insertionSort = () => {
    continueAnimation = true;
    const animations = sortingAlgorithms.insertionSort(mainArray);
    const totalAnimationTime = animations.length * 10;
    for (let i = 0; i < animations.length; i++) {
      setTimeout(() => {

        const arrayBars = document.getElementsByClassName('array-bar');
        const [operation, barOneIdx, barTwoIdxOrNewHeight] = animations[i];

        if (operation === 'comparison') {
          const color = 'red';
          const barOneStyle = arrayBars[barOneIdx] && arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdxOrNewHeight] && arrayBars[barTwoIdxOrNewHeight].style;
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        } else if (operation === 'swap') {
          const color = 'green';
          const barOneStyle = arrayBars[barOneIdx] && arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdxOrNewHeight] && arrayBars[barTwoIdxOrNewHeight].style;

          if (!barOneStyle || !barTwoStyle) {
            console.error(`Element style not found for indices ${barOneIdx} or ${barTwoIdxOrNewHeight}`);
            return;
          }

          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;

          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;
        } else if (operation === 'overwrite') {
          const barStyle = arrayBars[barOneIdx] && arrayBars[barOneIdx].style;
          if (!barStyle) {
            console.error(`Element style not found for index ${barOneIdx}`);
            return;
          }
          barStyle.height = `${barTwoIdxOrNewHeight}px`;
          const freq = arrayValueToFrequency(barTwoIdxOrNewHeight, minValue, maxValue, minFrequency, maxFrequency);
          playNote(freq, 0.1);
        }
      }, i * 10);
    }
    setTimeout(stopSoundRef.current, totalAnimationTime);
  }

  const heapSort = () => {
    continueAnimation = true;
    const animations = sortingAlgorithms.heapSort(mainArray);
    const totalAnimationTime = animations.length * 10;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 4 === 0 ? 'red' : 'green';
        setTimeout(() => {
          if (continueAnimation) {
            barOneStyle.backgroundColor = color;
            barTwoStyle.backgroundColor = color;
          }
        }, i * 10);
      } else {
        setTimeout(() => {
          if (continueAnimation) {
            const [barIdx, newHeight] = animations[i];
            const barStyle = arrayBars[barIdx].style;
            barStyle.height = `${newHeight}px`;
            const freq = arrayValueToFrequency(newHeight, minValue, maxValue, minFrequency, maxFrequency);
            playNote(freq, 0.1);
          }
        }, i * 10);
      }
    }
    setTimeout(stopSoundRef.current, totalAnimationTime);
  }

  const quickSort = () => {
    continueAnimation = true;
    const animations = sortingAlgorithms.quickSort(mainArray.slice());
    const totalAnimationTime = animations.length * 10;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      setTimeout(() => {
        if (continueAnimation) {
          const [barOneIdx, barTwoIdx, type] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdx].style;
          switch (type) {
            case "compare":
              barOneStyle.backgroundColor = 'blue';
              barTwoStyle.backgroundColor = 'blue';
              break;
            case "swap":
              const tempHeight = barOneStyle.height;
              barOneStyle.height = barTwoStyle.height;
              barTwoStyle.height = tempHeight;
              barOneStyle.backgroundColor = 'green';
              barTwoStyle.backgroundColor = 'green';
              const freq1 = arrayValueToFrequency(parseInt(barOneStyle.height), minValue, maxValue, minFrequency, maxFrequency);
              playNote(freq1, 0.1);
              const freq2 = arrayValueToFrequency(parseInt(barTwoStyle.height), minValue, maxValue, minFrequency, maxFrequency);
              playNote(freq2, 0.1);
              break;
            default:
              barOneStyle.backgroundColor = 'red';
              barTwoStyle.backgroundColor = 'red';
              break;
          }
        }
      }, i * 10);
    }
    setTimeout(() => {
      if (continueAnimation) {
        resetBarColors();
      }
      stopSoundRef.current();
    }, totalAnimationTime);
  }

  function resetBarColors() {
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      arrayBars[i].style.backgroundColor = 'green';
    }
  }

  useEffect(() => {
    resetArray();
  }, [])

  useEffect(() => {
    setMaxValue(Math.max(...mainArray));
  }, [mainArray]);

  useEffect(() => {
    playSoundRef.current = playSound;
    stopSoundRef.current = stopSound;
  }, [playSound, stopSound]);

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div className='min-w-screen min-h-screen flex flex-col bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100'>

      <div className='flex-grow flex flex-col justify-center items-center p-7 sm:p-3 md:p-5'>
        <div className='bg-light-gray rounded-xl p-5 drop-shadow-xl'>
          <h1 className='sm:text-xl md:text-2xl font-pressStart animate-appearFromBottom1 text-4xl text-bold text-center text-black'>Sortify</h1>
          <p className='sm:text-xxs md:text-sm font-pressStart animate-appearFromBottom2 text-base text-bold text-center text-black'>visualize your sorting algorithms with ease </p>
        </div>

        <div className='flex flex-grow w-full justify-center rounded-xl p-3 mt-6 bg-light-gray drop-shadow-xl max-h-[75vh] overflow-auto'>
          <div className='flex-grow flex flex-col items-center rounded-xl bg-transparent border-8 border-sky-400'>
            <div className='flex justify-center basis-10/12 h-1/2 min-w-full bg-black overflow-auto'>
              <div className="relative">
                {mainArray.map((value, id) => {
                  let barHeight = (value / maxValue) * 100;

                  return (
                    <div
                      ref={el => {
                        // If this is the last element in the array, assign the ref
                        if (id === mainArray.length - 1) {
                          myRef.current = el;
                        }
                      }}
                      className="w-0.5 xl:mx-0.5 lg:mx-0.5 md:mx-0.5 md:w-[0.5px] sm:mx-[0.07rem] sm:w-[0.015rem] inline-block mx-1 array-bar bg-white"
                      key={id}
                      style={{ height: `${barHeight}%` }}
                    >
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='basis-2/12 flex flex-col items-center justify-start w-full m-3'>
              <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-row sm:flex-col sm:space-y-3 items-center justify-center space-x-3 sm:space-x-0'>
                  <div className='flex flex-col items-center justify-center sm:w-full'>
                    <label className='font-pressStart text-xxs text-center'>Algoithm Type</label>
                    <select
                      className='text-xxs rounded-b-2xl font-pressStart p-1 w-full text-center'
                      onChange={e => setSortFunction(e.target.value)}
                      value={sortFunction}
                      id="Algorithms">
                      <option className='text-center' value="bubble">Bubble</option>
                      <option className='text-center' value="merge">Merge</option>
                      <option className='text-center' value="quick">Quick</option>
                      <option className='text-center' value="insert">Insert</option>
                      <option className='text-center' value="heap">Heap</option>
                    </select>
                  </div>
                </div>
                <div className='flex flex-row space-x-3'>
                  <button onClick={resetArray} className='text-center text-xxs font-pressStart mt-3 bg-sky-400 hover:bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 text-white font-bold py-2 px-4 rounded self-center'>Reset</button>
                  <button onClick={sortArray} className='text-center text-xxs font-pressStart mt-3 bg-sky-400 hover:bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 text-white font-bold py-2 px-4 rounded self-center'>Sort</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='overflow-hidden'>
        <p className='whitespace-nowrap text-center text-2xl text-black hover:underline hover:curs font-bebas animate-marquee'>
          <Link target="_blank" href="https://github.com/reecebaileyy/Sortify">An Open Source Project Managed By Reece Bailey</Link>
        </p>
      </div>



    </div>
  )
}
