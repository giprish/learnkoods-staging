import SearchBox from "../../messages/components/SearchBox";
import ContactList from "../../messages/components/ContactList";
import ContentField from "../../messages/components/ContentField";
import { useDispatch } from "react-redux";
import { chatSidebarToggle } from "../../../../../features/toggle/toggleSlice";

const MessageBox = () => {
  const dispatch = useDispatch();

  const chatToggle = () => {
    dispatch(chatSidebarToggle());
  };

  return (
    <div className="row">
      {/* End chat_contact */}

      <div className=" col-xl-8 col-lg-7 col-md-12 col-sm-12 chat">
        <ContentField />
      </div>
      {/* MessageBox-field-content */}
    </div>
  );
};

export default MessageBox;
