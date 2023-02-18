import { useState } from "react";

import Styles from "./Message.module.css";

const Message = ({ msgText }) => {

    const [display, setDisplay] = useState('')

  return (
    <div onClick={e =>  setDisplay("none")} className={`${Styles.msg_container} ${display == "none" ? Styles.display_none : ''}`}>
      <div className={Styles.msg_box}>
        <button className={Styles.msg_close_btn} onClick={(e) => setDisplay("none") }>X</button>
        <p className={Styles.msg_txt}>{msgText}</p>
      </div>
    </div>
  );
};

export default Message;
