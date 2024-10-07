import axios from 'axios';
import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { serverUrl } from '../api';

function ToogleTeamLead({id,active}) {
  const [isOn, setIsOn] = useState(active);

  const toggle = () => {
    setIsOn(!isOn);
    console.log("wduwud")
    axios.put(`${serverUrl}/api/agent/edit/${id}`,{isTeamlead:!isOn})
    .then((res) => {
        console.log(res)
        if (res.payload.status){
            alert(isOn ? "Lead" : "Agent");
        }
    })
    .catch((err) => {
        toast.error(err);
    });
  };

  return (
    <div className="relative">
      <label className="flex items-center cursor-pointer">
      <div className={`w-8 h-5 rounded-full p-1 duration-300 ${!isOn ? 'bg-main' : 'bg-blue-600'}`}>
          <div className={`toggle__dot w-3 h-3 bg-white rounded-full shadow-md transform ${isOn ? 'translate-x-full' : ''} duration-300`} />
        </div>
        <input type="checkbox" className="hidden" checked={isOn} onChange={toggle} />
      </label>
    </div>
  );
}

export default ToogleTeamLead;
