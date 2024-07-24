import axios from "axios";
import Map from "../../../Map";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

const RegisterContactInfoBox = ({ onSubmit }) => {
  const { register, handleSubmit, control } = useFormContext();
  const fetchCity = async () => {
    const response = await axios.get(` ${process.env.GLOBAL_API}/city/`);
    return response.data;
  };

  const { data: cities } = useQuery({
    queryKey: ["cityData"],
    queryFn: () => fetchCity(),
  });

  const options = cities?.data?.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <select className="chosen-single form-select">
            <option>Pakistan</option>
            <option>Chaina</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          {/* <select
            className="chosen-single form-select"
            required
            {...register("city")}
          >
            {cities?.data?.map((city) => {
              return (
                <>
                  <option value={city?.name}>{city?.name}</option>
                </>
              );
            })}
            
          </select> */}
          <Controller
            name="city"
            control={control}
            // defaultValue={[]}
            rules={{ required: "Please select city" }}
            render={({ field }) => (
              <Select
                {...field}
                name="city"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            required
            {...register("address")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Find On Map</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Latitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Longitude</label>
          <input type="text" name="name" placeholder="Melbourne" />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-three">Search Location</button>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div>
        {/* End MapBox */}

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterContactInfoBox;
