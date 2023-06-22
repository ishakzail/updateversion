import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useContext, useEffect, useState } from "react";
const { log } = console;
import { MatterJsModules } from '../utils/MatterJsModules'
import { MyContext } from '@/components/Context';
import { io } from "socket.io-client"

import { ModalGame } from '@/components/Modal';

import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Game() {
  const context = useContext(MyContext);
  const router = useRouter();
  const [joinRoom, setJoinRoom] = useState<string>("hidden")
  const [roomName, setRoomName] = useState<string>("")
  const [height, setHeight] = useState<number>(400)
  const [score, setScore] = useState({ left: 0, right: 0 })
  const [countDown, setCountDown] = useState(5);
  const [animations, setAnimations] = useState(1)
  const [matterjsInstance, setMatterjsInstance] = useState<MatterJsModules>()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winner, setWinner] = useState('')
  const [gameStatus, setGameStatus] = useState(false)
  const [gameStatusMsg, setGameStatusMsg] = useState("Waiting for a player to join...")
  const [restart, setRestart] = useState(false)
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  var token: string | null = '';
  useEffect(() => {
    if (context?.token) {
      var socket = io("http://localhost:3333", {
        extraHeaders: {
          Authorization: context?.token,
        }
      });
      socket.on('message', (payload: any) => {
        console.log("111111111111111");
        console.log(`Received message: ${payload}`);
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });
      socket.on('errorMessage', (payload: any) => {
        console.log("111111111111111");

        console.log(`Received message: ${payload}`);
        // SetToMessages(payload);
        // setMessages([...messages, payload]);
      });
      context.setSocket(socket);

    }
  }, [context?.token]);
  useEffect(() => {
    console.log(animations)

    if (countDown <= 4) {

      const timer = setTimeout(() => {

        setCountDown(countDown + 1);
        setAnimations(animations + 1)
        if (countDown == 2)
          setAnimations(animations + 2)
      }, 1000); // Example: Increment count every 2 seconds

      return () => clearTimeout(timer);
    }

  }, [countDown]);

  const handleRoomName = (e: any) => {
    setRoomName(e.target.value)
  }

  useEffect(() => {
    const matterContainer = document.querySelector("#matter-Container") as HTMLElement

    setHeight(matterContainer.clientWidth * 16 / 9)
    const handleResize = () => {

      setHeight(matterContainer.clientWidth * 16 / 9); // Update the width based on the window size
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);
  useEffect(() => {
    matterjsInstance?.onWindowSizeChange()

  }, [height])

 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setJoinRoom("go")
      const { room, queue } = router.query;
    log("this is the query", room, queue)
      if (room && queue){
        const openQueue = queue === "true" ? true : false
        const MatterNode = new MatterJsModules(`${room}`, openQueue, context?.socket)
        setMatterjsInstance(MatterNode)
        MatterNode.gameStatusListener(setGameStatus, setGameStatusMsg)
        MatterNode.createModules()
        MatterNode.createBodies()
        MatterNode.events()
        MatterNode.run()
        MatterNode.socketStuff()
        MatterNode.updateGameScore(setScore, setCountDown)
        MatterNode.gameOverListener(setIsModalOpen, setWinner)
        MatterNode.restartGameListener(setIsModalOpen)
      }
    }, 1000); // 2000 milliseconds = 2 seconds

    return () => {
      // Clean up the timeout when the component unmounts or the effect re-runs
      clearTimeout(timeoutId);
    };
  
  }, [context?.socket, router.query]); // Empty dependency array to run the effect only once


  const handleResize = () => {
    setHeight(window.innerWidth); // Update the width based on the window size
  };
  const divStyle = {
    height: `${height}px`,

  };


  useEffect(() => {
    if (restart) {
      matterjsInstance?.restartMatch(setWinner, setRestart)
    }

  }, [restart])

  useEffect(()=>{
    if (!winner.length)
      setIsModalOpen(!gameStatus);
  },[gameStatus])


  const deletThis = () => {
    setIsModalOpen(true);

  }
console.log("Game status", gameStatus)
console.log("winner", winner)
console.log("status", gameStatusMsg)


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

        {isModalOpen && <ModalGame isOpen={isModalOpen} closeModal={closeModal} title={gameStatus ?  "WINNER": ""} msg={gameStatus ? winner : gameStatusMsg} color='bg-white' />}
        {
          <div className="relative flex justify-center items-center flex-col">
            <div className="relative h-[50px] w-[375px] flex items-center  bg-[#a22d2d]">
              <div className='absolute left-5 flex flex-col items-center justify-center'>
                <span className="text-white font-semibold"> player1 </span>
                <span className="text-white"> {score.left}</span>
              </div>
              <div className='absolute right-5 flex flex-col items-center justify-center'>
                <span className="text-white font-semibold"> player2 </span>
                <span className="text-white">{score.right}</span>
              </div>
            </div>
            <div id="matter-Container" style={divStyle} className={` w-full max-w-[623px] bg-white ${!joinRoom && "hidden"}`}>  </div>
            {
              countDown <= 4 &&
              <div className="absolute text-white text-xl "
                style={{ animationName: 'fadeout, growup', animationDuration: '1s', animationIterationCount: `${animations}` }}>
                {countDown == 4 ? 'GO' : countDown}
              </div>
            }

          </div>
        }
      </main>
    </>
  )
}
