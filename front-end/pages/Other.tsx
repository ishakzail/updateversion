import React, { useContext, useEffect, useState } from 'react';
import Statics from '../image/statics.svg'
import 'react-circular-progressbar/dist/styles.css';
import LevelStatics, {Stats} from '@/components/Statics'
import RealFooter from '@/components/RealFooter';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons';
import {DataFunction, CallBarLeft} from '@/components/Functions';
import NavBar from '@/components/NavBar';
import { MyContext , ContextTypes} from '@/components/Context';
import Modal from '@/components/Modal';
import axios from 'axios';
import {io} from "socket.io-client";
import createSocketConnection from '@/components/socketConnection'
import { useRouter } from 'next/router';
import { MesgType } from '@/components/Context';
import mhaddaou from '../image/mhaddaou.jpg'
import Sky from '../image/sky.png'


const Other = () =>{
    const context = useContext(MyContext)
    return(
        <div className='bg-gradient-to-t from-gray-100 to-gray-400 min-h-screen ' >
      <div className='flex flex-col container mx-auto h-screen min-h-[1100px] py-2 gap-3  '>
      {/* {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModal} title={name} msg={mms} color="bg-white"/>} */}
      <div className=' h-1/2 flex md:space-x-2'>
        <div className="hidden md:flex md:flex-col min-w-[130px]  md:w-[15%]  bg-gray-200 shadow-2xl shadow-gray-200  rounded-2xl dark:bg-gray-700 pt-4   ">
                   <div className=" self-center">
                   <FontAwesomeIcon  icon={faTableTennisPaddleBall} flip size="2xl" style={{color:'#0369a1'}}/>                
                   </div>
                   <div className="mt-6">
                    <CallBarLeft page="Profile" />
                   </div>
               </div>
        <div className=' w-[100%] md:w-[85%]  rounded-2xl flex flex-col space-y-2 md:space-y-4'>
          <NavBar page='Dashbord' />
          <div className=' h-[88%] md:h-[86%]  rounded-2xl flex flex-col'>
            
          <div className="h-1/2 w-full relative">
      <div className="h-full w-full rounded-2xl overflow-hidden">
        <div className="h-full w-full bg-cover">
          <Image
            src={Sky}
            alt="Sky"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <Image src={mhaddaou} alt='mha' />
          <h1 className="text-4xl text-white">Content Above Image</h1>
        </div>
      </div>
    </div>
            <div className='bg-gray-200 w-full  h-1/2 rounded-2xl px-8 md:px-0  overflow-y-auto scrollbar-thin'>
              <div className='h-full  w-full flex  flex-col gap-4 md:flex-row md:justify-around md:items-center'>
                
              <LevelStatics level={context?.level || 0} per={context?.LevlPer || 0} />
              <Stats per={context?.wins || 0} name='Wins' />
              <Stats per={context?.losses || 0} name='Losses' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' h-1/2 flex flex-col space-y-3 bg-gray-200 rounded-2xl stack '>
        <div className='h-[25%]  flex justify-around items-center  rounded-2xl '>
          <button className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>History</button>
          <button  className='font-bold md:text-xl font-mono border-b-4 rounded-b-xl border-slate-600 hover:border-cyan-600'>Achievement</button>
         
          
          
        </div>
        <div className='h-[75%] w-full shadow-lg bg-gray-100  shadow-slate-600 rounded-2xl overflow-x-auto flex'>
          {/* {DataFunction(check)} */}
        </div>
      </div>
      </div>
      <RealFooter />
    </div>

    );
}

export default Other;