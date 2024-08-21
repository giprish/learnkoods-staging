import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

const RegisterFormInfoBox = ({ onSubmit, handelLogo }) => {
  const { register, handleSubmit, control } = useFormContext();
  const fetchIndustry = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/industry_api/`);
    return response.data;
  };

  const { data: industry } = useQuery({
    queryKey: ["industryData"],
    queryFn: () => fetchIndustry(),
  });

  const options = industry?.data?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const fetchCity = async () => {
    const response = await axios.get(` ${process.env.GLOBAL_API}/city/`);
    return response.data;
  };

  const { data: cities } = useQuery({
    queryKey: ["cityData"],
    queryFn: () => fetchCity(),
  });

  const cityoptions = cities?.data?.map((option) => ({
    value: option.id,
    label: option.name,
  }));
  // console.log(industry, "industry");
  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Company name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Example pvt. Ltd."
            required
            {...register("name")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Email address <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            required
            {...register("email")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Phone <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="phone_number"
            placeholder="0 123 456 7890"
            required
            {...register("phone_number")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Company Website <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="url"
            name="website"
            placeholder="www.example.com"
            required
            {...register("website")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Est. Since</label>
          <input
            type="date"
            name="established"
            placeholder="06.04.2020"
            className="form-control py-3"
            // {...register("established")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Team Size</label>
          <select
            className="chosen-single form-select"

            // {...register("team_size")}
          >
            <option>50 - 100</option>
            <option>100 - 150</option>
            <option>200 - 250</option>
            <option>300 - 350</option>
            <option>500 - 1000</option>
          </select>
        </div>

        {/* <!-- Search Select --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Industry <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="industry"
            control={control}
            // defaultValue={[]}
            rules={{ required: "Please select industry" }}
            render={({ field }) => (
              <Select
                {...field}
                // defaultValue={[]}
                // isMulti
                name="industry"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label className="" for="job_image">
            Company Logo <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control py-3 "
            type="file"
            name="profile_image"
            accept="image/*"
            id="upload"
            required
            onChange={(e) => {
              handelLogo(e);
            }}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>
            City <span style={{ color: "red" }}>*</span>
          </label>
          <Controller
            name="city"
            control={control}
            // defaultValue={[]}
            rules={{ required: "Please select city" }}
            render={({ field }) => (
              <Select
                {...field}
                name="city"
                options={cityoptions}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>
            Complete Address <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            required
            {...register("address")}
          />
        </div>

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>About Company</label>
          <textarea
            placeholder="Welcome to [Company Name], where innovation meets excellence. Founded in [Year], we are dedicated to delivering top-quality [products/services] that make a difference in people's lives. Our mission is to [brief mission statement or core goal], and we strive to achieve this through [brief mention of strategy or values].At [Company Name], our team of passionate professionals is committed to [mention unique selling points, e.g., customer satisfaction, sustainable practices, cutting-edge technology, etc.]. We believe in continuous improvement and are always looking for new ways to innovate and grow.Join us on our journey as we aim to shape the future of [industry or field] and provide unmatched value to our customers."
            {...register("description")}
          ></textarea>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button className="theme-btn btn-style-one" type="submit">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterFormInfoBox;
