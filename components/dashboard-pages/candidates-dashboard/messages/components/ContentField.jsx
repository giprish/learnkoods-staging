import ChatHamburger from "../../../employers-dashboard/messages/components/ChatHamburger";

const ChatBoxContentField = () => {
  return (
    <div className="card message-card">
      <div className="card-header msg_head">
        <div className="d-flex bd-highlight">
          <div className="img_cont">
            <Image
              width={48}
              height={48}
              src="/images/resource/s.png"
              alt="candidates"
              className="rounded-circle user_img"
            />
          </div>
          <div className="user_info">
            <span>Skillthrive</span>
            <p>Active</p>
          </div>
        </div>

        <div className="btn-box">
          <button className="dlt-chat">Delete Conversation</button>
          <ChatHamburger />
        </div>
      </div>
      {/* End .cart-header */}

      <div className="card-body msg_card_body">
        <div className="d-flex justify-content-start mb-2">
          <div className="img_cont_msg">
            <Image
              width={48}
              height={48}
              src="/images/resource/s.png"
              alt="candidates"
              className="rounded-circle user_img_msg"
            />
            <div className="name">
              Skillthrive <span className="msg_time">Just now</span>
            </div>
          </div>
          <div className="msg_cotainer">
            Thank you for registering at SkillThrive. We are excited for you to
            have on board!
          </div>
        </div>

        <div className="d-flex justify-content-end mb-2 reply">
          <div className="img_cont_msg">
            <img
              src="/images/resource/candidate-4.webp"
              alt=""
              className="rounded-circle user_img_msg"
            />
            <div className="name">
              You <span className="msg_time">35 mins</span>
            </div>
          </div>
          <div className="msg_cotainer">Thanks.</div>
        </div>
        {/* 
        <div className="d-flex justify-content-start">
          <div className="img_cont_msg">
            <img
              src="/images/resource/candidate-2.webp"
              alt=""
              className="rounded-circle user_img_msg"
            />
            <div className="name">
              Cameron Williamson <span className="msg_time">35 mins</span>
            </div>
          </div>
          <div className="msg_cotainer">Ok, Understood!</div>
        </div> */}
      </div>
      {/* End .card-body */}

      <div className="card-footer">
        <div className="form-group mb-0">
          <form>
            <textarea
              className="form-control type_msg"
              placeholder="Type a message..."
              disabled
            ></textarea>
            <button
              type="submit"
              className="theme-btn btn-style-one submit-btn"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      {/* End .card-footer */}
    </div>
  );
};

export default ChatBoxContentField;
