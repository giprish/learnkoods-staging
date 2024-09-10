import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../features/filter/filterSlice";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Categories = () => {
  const { jobList } = useSelector((state) => state.filter) || {};
  const [getCategory, setCategory] = useState(jobList.category);

  const dispatch = useDispatch();

  // category handler
  const categoryHandler = (e) => {
    dispatch(addCategory(e.target.value));
  };

  useEffect(() => {
    setCategory(jobList.category);
  }, [setCategory, jobList]);

  const fetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: categories } = useQuery({
    queryKey: ["categoryData"],
    queryFn: () => fetch(`${process.env.GLOBAL_API}/cat-api/`),
  });

  // console.log(categories, "categories ");

  return (
    <>
      <select
        className="form-select"
        value={jobList.category}
        onChange={categoryHandler}
      >
        {/* Default option with empty value */}
        <option value="">Choose a category</option>

        {/* Dynamically generated options */}
        {categories?.message.map((category) => {
          return (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          );
        })}
      </select>
      <span className="icon flaticon-briefcase"></span>
    </>
  );
};

export default Categories;
