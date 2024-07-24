import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword } from "../../../features/filter/filterSlice";

const SearchBox = () => {
  const { jobList } = useSelector((state) => state.filter);
  const [getKeyWord, setkeyWord] = useState(jobList.keyword);
  const dispath = useDispatch();
  const [typingTimeout, setTypingTimeout] = useState(null);

  // keyword handler
  const keywordHandler = (e) => {
    const newValue = e.target.value;
    setkeyWord(newValue);
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        dispath(addKeyword(e.target.value));
      }, 2000)
    );
  };

  useEffect(() => {
    setkeyWord(jobList.keyword);
  }, [setkeyWord, jobList]);

  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Job title, keywords, or company"
        value={getKeyWord}
        onChange={keywordHandler}
      />
      <span className="icon flaticon-search-3"></span>
    </>
  );
};

export default SearchBox;
