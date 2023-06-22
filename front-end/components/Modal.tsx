import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./Context";
import {Star} from 'react-feather'
import Avatar from '../image/avatar.webp'
import Image, { StaticImageData } from "next/image";
import { FriendType } from "./Context";
import Router from "next/router";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title : string;
  msg: string;
  color : string

}
import  { ReactNode } from 'react';
import axios from "axios";



const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const context = useContext(MyContext);
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`${color} p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-700 mb-6">
          {msg}
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() =>{
              closeModal()
              context?.setChn(true);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



interface ModalChatProps {
  
  isOpen: boolean;
  closeModal: () => void;
  name : string;
  login : string;

}

const ModalChat: React.FC<ModalChatProps> = ({ isOpen, closeModal, name, login }) => {
  const context = useContext(MyContext);
  const value = useRef<HTMLTextAreaElement| null >(null);



  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }
  const sendMsg = () =>{
    if (value.current){
      if (context?.socket){
        context.socket.emit('PrivateMessage', {
          receiver : login,
          content : value.current.value
        })
        context.socket.on('message', (payload: any) => {
          console.log("111111111111111");
          console.log(`Received message: ${payload}`);
          // SetToMessages(payload);
          // setMessages([...messages, payload]);
        });
        context.socket.on('errorMessage', (payload: any) => {
          console.log("22222222222");
  
          console.log(`Received message: ${payload}`);
          // SetToMessages(payload);
          // setMessages([...messages, payload]);
        });
      } 
      closeModal();
    }
  }

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-white p-6 rounded-md flex flex-col gap-3 ` }>
        <h2 className="text-2xl font-bold mb-4 text-center">New message to @{name}</h2>
        <div className="w-full h-[70%] bg-blu-400 flex justify-center ">
        <textarea  ref={value} className=" textarea textarea-ghost h-full w-full max-h-[250px] sm:max-h-[300px]" placeholder="Type a message..."></textarea>
          

        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button onClick={sendMsg} className="px-4 py-2 bg-blue-500 text-slate-100 rounded hover:bg-blue-800">send message</button>
        </div>
      </div>
    </div>
  );
};

interface ModalChannel{
  isOpen: boolean;
  closeModal: () => void;

}


const ModalUpdateChannel: React.FC<ModalChannel> = ({ isOpen, closeModal }) => {
  const [file, setFile] = useState<File | null>(null)
  let imgSrc: string | Blob | MediaSource | StaticImageData;
  const [url, setUrl] = useState<string | null>(null);
  const [avatar, setAvatar] = useState("")
  function sendToBck(Url: string) {
    if (context?.socket) {
      context?.socket.emit("updateUser", { avatar: Url });
    }
  }


  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      const form = new FormData();

      if (file) {
        form.append("file", file);
        form.append("upload_preset", "mhaddaou");

        if ((file.type !== "image/jpeg") && (file.type !== "image/png")) {
          setColor('bg-orange-600');
          setMsg('this image is not jpeg or PNG');
          setTitle('Warning!');
          setIsModalOpen(true);
          reject('Invalid image type');
        } else if ((file.size / (1024 * 1024)) > 10) {
          setColor('bg-orange-600');
          setMsg('this image is more than 6MB');
          setTitle('Warning!');
          setIsModalOpen(true);
          reject('Image size is too large');
        } else {
          axios.post("https://api.cloudinary.com/v1_1/daczu80rh/upload", form)
            .then((result) => {
              setUrl(result.data.secure_url);
              // context?.setImg(result.data.secure_url);
              setAvatar(result.data.secure_url);
              setColor('bg-green-500');
              setMsg('The image was successfully uploaded');
              setTitle('Success!');
              setIsModalOpen(true);
              resolve(`${result.data.secure_url}`);
            })
            .catch((error) => {
              reject(error);
            });
        }
        setFile(null);
      } else {
        setColor('bg-orange-600');
        setMsg('the image is empty');
        setTitle('Warning!');
        setIsModalOpen(true);
        reject('No image selected');
      }
    });
  };
  const passref = useRef<HTMLInputElement | null>(null);
  const chanref = useRef<HTMLInputElement | null>(null);
const [msg , setMsg] = useState('');
const [color, setColor] = useState('');
const [title, setTitle] = useState('');
  const context = useContext(MyContext);
  useEffect(() =>{
    if (context?.socket)
    context?.socket.on('message', (pay) =>{
      console.log(pay);
      setMsg(pay);
      setColor('bg-green-400');
      setTitle('Success');
      openModal()
    })
    if (context?.socket)
    context?.socket.on('errorMessage', (pay)=>{
      console.log(pay)
      setMsg(pay.message);
      setColor('bg-orange-400');
      setTitle('Failed');
      openModal()
    })

  }, [context?.socket])

  useEffect(() =>{
    if (context?.chn)
      closeModal()
    context?.setChn(false);
  }, [context?.chn])

  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  
  interface newChannel {
    avatar: string;
    channelName: string;   // Required
    isPrivate: boolean;    // Required
    ispassword: boolean;   // Required
    password?: string;     // Optional
    }

    const[check, setCheck] = useState(false);
    const [pass,setPass ] = useState(false);
    const clickPass = () =>{
      setPass(!pass);
    }

    const clickcheck = () =>{
      setCheck(!check);
    }

    const Update = () => {
      if (pass && check) {
        if (chanref.current && passref.current)
          updateChannel(chanref.current.value, check, pass, passref.current.value)
      }
      else if (pass) {
        if (chanref.current && passref.current)
          updateChannel(chanref.current.value, check, pass, passref.current.value)
      }
      else if (check) {
        if (context?.channelInfo)
          updateChannel(context.channelInfo.channelName, check, pass, "")
      }
      else {
        if (chanref.current) {
          updateChannel(chanref.current.value, check, pass, "")
        }
      }
    }
  
    function updateChannel(channel: string, isPrivat: boolean, pass: boolean, password: string) {
      var msg: newChannel | string = '';
      if (chanref.current) {
        uploadImage().then((secureUrl) => {
          if (chanref.current) {
            msg = {
              avatar: `${secureUrl}`,
              channelName: channel,
              isPrivate: isPrivat,
              ispassword: pass,
              password: password,
            }
            context?.socket?.emit('updateChannel', msg)
            const removeChannelByName = (channelName: string) => {
              context?.setChannels(prevChannels =>
                prevChannels.filter(channel => channel.channelName !== channelName)
              );
            };
            removeChannelByName(channel)
            context?.setChannels((prev) => [...prev, { avatar: `${secureUrl}`, channelName: channel }])
          }
        })
      }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
    const closeModale = () => {
      setIsModalOpen(false);
    };
    const [value, setValue] = useState(context?.channelInfo?.channelName); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    }
  
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("tries to upload")
      if (e.target.files)
        setFile(e.target.files[0]);
  
  
    }    

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModale} title={title} msg={msg} color={color} />}
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-4">Update Channel</h2>
        <div className="bg-re mb-5 flex flex-col gap-2 pt-4">
        <div className="font-semibold mb-2 font-mono">
            <p className="mb-1" >Avatar <span className="text-xs">
              (optional)
            </span>
            </p>
            <label className=" cursor-pointer flex-shrink-0 bg-slate-500 hover:bg-slate-700 border-slate-500 hover:border-slate-700 text-sm border-4 text-white py-1 px-2 rounded" >
              <input onChange={handleUpload} type="file" className="hidden" />
              select file
            </label>
          </div>
          <div className="font-semibold font-mono">

            <p >Channel Name</p>
            <input type="text" value={value} onChange={handleChange} ref={chanref} placeholder="Name Channel" className="input input-bordered input-sm w-full max-w-xs" />
          </div>
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Password</span> 
              <input type="checkbox" ref={passref} onClick={clickPass} checked={pass} className="checkbox" />
            </label>
          </div>
          <input type="password" placeholder="Password" className="input input-bordered input-sm w-full max-w-xs" />

         
          
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Private Channel</span> 
              <input type="checkbox" onClick={clickcheck} checked={check} className="checkbox" />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={Update}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalCreateChannel: React.FC<ModalChannel> = ({ isOpen, closeModal }) => {
  const passref = useRef<HTMLInputElement | null>(null);
  const chanref = useRef<HTMLInputElement | null>(null);
const [msg , setMsg] = useState('');
const [color, setColor] = useState('');
const [title, setTitle] = useState('');
  const context = useContext(MyContext);
  useEffect(() =>{
    if (context?.socket)
    context?.socket.on('message', (pay) =>{
      console.log(pay);
      setMsg(pay);
      setColor('bg-green-400');
      setTitle('Success');
      openModal()
      if (chanref.current){
        const chann = {
          avatar: "0",
          channelName: chanref.current.value,
        }
        context.setChannels((old) =>[...old, chann]);
      }
    })
    if (context?.socket)
    context?.socket.on('errorMessage', (pay)=>{
      console.log(pay)
      setMsg(pay.message);
      setColor('bg-orange-400');
      setTitle('Failed');
      openModal()
    })

  }, [context?.socket])

  useEffect(() =>{
    if (context?.chn)
      closeModal()
    context?.setChn(false);
  }, [context?.chn])

  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  
  interface newChannel {
    channelName: string;   // Required
    isPrivate: boolean;    // Required
    ispassword: boolean;   // Required
    password?: string;     // Optional
    }

    const[check, setCheck] = useState(false);
    const [pass,setPass ] = useState(false);
    const clickPass = () =>{
      setPass(!pass);
    }

    const clickcheck = () =>{
      setCheck(!check);
    }

    const Create = () =>{
      if (pass && check){
        var msg : newChannel | string = '';
        if (chanref.current && passref.current){
          msg  = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: passref.current.value,
          }
        }
        context?.socket?.emit('newChannel',msg)
      // closeModal()

      }
      else if (pass){
        var msg : newChannel | string = '';

        if (chanref.current && passref.current){
          msg  = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: passref.current.value,
          }

        }
        context?.socket?.emit('newChannel',msg)
      // closeModal()
      openModal();


      }
      else if(check){
        var msg : newChannel | string = '';

        if (chanref.current ){
          const msg : newChannel = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: '',
          }

          context?.socket?.emit('newChannel',msg)
        }
      // closeModal()

      }
      else{

        var msg : newChannel | string = '';

        if (chanref.current ){
          console.log(chanref.current.value);
          msg  = {
            channelName: chanref.current.value,
            isPrivate: check,
            ispassword : pass,
            password: '',
          }
        }
        context?.socket?.emit('newChannel',msg)
      }
      
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
    const closeModale = () => {
      setIsModalOpen(false);
    };


    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      {isModalOpen && <Modal isOpen={isModalOpen} closeModal={closeModale} title={title} msg={msg} color={color} />}
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2 pb-4">Create Channel</h2>
        <div className="bg-re mb-5 flex flex-col gap-2 pt-4">
          <div className="font-semibold font-mono">
            <p >name of channel</p>
            <input type="text" ref={chanref} placeholder="Name Channel" className="input input-bordered input-sm w-full max-w-xs" />
          </div>
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Password</span> 
              <input type="checkbox" ref={passref} onClick={clickPass} checked={pass} className="checkbox" />
            </label>
          </div>
          <input type="password" placeholder="Password" className="input input-bordered input-sm w-full max-w-xs" />

         
          
          <div className="form-control font-semibold font-mono">
            <label className="label cursor-pointer">
              <span className="label-text">Private Channel</span> 
              <input type="checkbox" onClick={clickcheck} checked={check} className="checkbox" />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={Create}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};


// const ModalUpdateCHannel = () =>{
//   reuturn l
// }



//  <div className="font-semibold font-mono">
//             <p>password</p>
//             <input type="text" placeholder="password" className="input input-bordered input-sm w-full max-w-xs" />
//           </div>


export interface dataProp{
  UserId: string;
  login: string,
  username:string;
  email: string,
  avatar: string;
  enableTwoFa: boolean,
  twoFactorSecret: string,
  bioGra: string,
  lvl: number
}

interface ModalSearchProps{
  isOpen : boolean;
  closeModal : () => void;
  data : dataProp | undefined;

}



const ModalSearch= (props : ModalSearchProps) => {
  const context = useContext(MyContext);

  const GetAvatar = ({avat } : {avat : string | undefined}) =>{
    if (avat === '0')
      return (
        <Image src={Avatar} alt="ava" />
      );
    else
        return (
          <img src={avat} alt="ava" />
        );
  }


  if (!props.isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  const removeChat = (login : string) =>{
    context?.setWaitToAccept(prevcontact =>
      prevcontact.filter(chat => chat.login !== login))
  }
 

  const sendInvite = () =>{

    if (props.data?.login){
      context?.socket?.emit('inviteFriend',{
        login : props.data.login,
      })
      // if (props.data)
      
      const friend : FriendType = {
        login : props.data.login,
        username : props.data.username,
        avatar : props.data.avatar,
      }
      removeChat(props.data.login)
      context?.setWaitToAccept((prev)=>[...prev, friend])

      // when i add this
    }
    props.closeModal()
    context?.setChn(true);
    console.log(props.data?.login);
  }


  useEffect(() =>{
    if (context?.socket){
      context.socket.on('message', (pay) =>{
        if (pay)
          console.log(pay);
      })
      context.socket.on('errorMessage', (pay) =>{
        if (pay)
          console.log(pay);
      })
    }
  }, [context?.socket])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-white p-6 rounded-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Search</h2>
        <div className="flex  justify-center items-center gap-4 p-10">
          

            <div className="avatar">
        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <GetAvatar avat={props.data?.avatar} />
        </div>
      </div>
        
      <div>{props.data?.username}</div>

        </div>
        
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() =>{
              props.closeModal()
              context?.setChn(true);
            }}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-200 text-slate-500 rounded hover:bg-gray-300"
            onClick={() =>{
              sendInvite();
              
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalGame: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className=" absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-[#7e22ce] p-6 rounded-md`}>
        {
          title.length ? (

            <div className="flex justify-center gap-2">
            <Star fill="gold" color='gold' />
            <Star className="pt-1" fill="gold" color='gold' />
            <Star fill="gold" color='gold' />
          </div>
            ) : null
        }
        <h2 className="text-2xl text-white font-bold mt-6 text-center">{title}</h2>
        <h2 className={`text-2xl ${ title.length ? `text-[#FFD700]` : `text-[#e9e8e2]`} font-bold mb-6 text-center`}>{msg}</h2>
        <div className="flex justify-end gap-2">
          {
            title.length ? (

              <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={closeModal}
              >
              Replay
            </button>
              ) : null
          }
          <button className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Leave</button>
        </div>
      </div>
    </div>
  );
};
const ModalInvite: React.FC<ModalProps> = ({ isOpen, closeModal, title, msg, color }) => {
  const router = Router;
  const context = useContext(MyContext);
  const handleAccept = () => {
    const url = `Game?room=${color}&queue=false`;
    router.push(`http://localhost:3000/${url}`)
  }

  const handleDecline = () => {
    if(context?.socket)
    context?.socket.emit("cancelGame", {
      host: color
    })
    closeModal()
  }
  if (!isOpen) {
    return null; // If isOpen is false, don't render the modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className={`bg-[#7e22ce] p-6 rounded-md`}>
        {
          title.length &&
          <div className="flex justify-center gap-2">
            <Star fill="gold" color='gold' />
            <Star className="pt-1" fill="gold" color='gold' />
            <Star fill="gold" color='gold' />
          </div>
        }
        <h2 className="text-2xl text-white font-bold mt-6 text-center">{title}</h2>
        <h2 className="text-2xl text-[#FFD700] font-bold mb-6 text-center">{msg}</h2>
        <div className="flex justify-end gap-2">
          {
            title.length &&
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={handleAccept}
            >
              Accept
            </button>
          }
          <button onClick={handleDecline} className="px-4 py-2 bg-red-200 text-gray-700 rounded hover:bg-red-300">Decline</button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
 export {ModalChat,ModalInvite, ModalCreateChannel, ModalUpdateChannel, ModalSearch, ModalGame};
