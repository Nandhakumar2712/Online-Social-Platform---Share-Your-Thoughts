import React , {useState , useEffect} from 'react';

function Time()
{

    const [time , setTime] = useState(0);
    const[isRunning , setRunning] = useState(false);
    useEffect(() =>
    {
        let Inter
         if(isRunning)
         {
             Inter = setInterval( () =>
                            {
                                setTime((t) => t+1)
                            },1000);

         }


    return ()=>{ clearInterval(Inter)};
    },[isRunning])
let stop = () =>
    {
        setRunning(false)
        return(setTIme(0));
    }
 let start = () =>
    {
        setRunning(true);
        }

    return(
        <div>
            Time: {time} seconds
            <button onClick = {stop}>stop</button>
                <button onClick  = {start}>start</button>
            </div>
          );
    }


export default Time