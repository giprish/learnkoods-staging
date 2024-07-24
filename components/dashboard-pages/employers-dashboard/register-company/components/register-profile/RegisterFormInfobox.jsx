import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

const RegisterFormInfoBox = ({ onSubmit }) => {
  // const catOptions = [
  //   { value: "Banking", label: "Banking" },
  //   { value: "Digital & Creative", label: "Digital & Creative" },
  //   { value: "Retail", label: "Retail" },
  //   { value: "Human Resources", label: "Human Resources" },
  //   { value: "Managemnet", label: "Managemnet" },
  //   { value: "Accounting & Finance", label: "Accounting & Finance" },
  //   { value: "Digital", label: "Digital" },
  //   { value: "Creative Art", label: "Creative Art" },
  // ];
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
  // console.log(industry, "industry");
  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Company name (optional)</label>
          <input
            type="text"
            name="name"
            placeholder="Invisionn"
            required
            {...register("name")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="ib-themes"
            required
            {...register("email")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Phone</label>
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
          <label>Website</label>
          <input
            type="url"
            name="website"
            placeholder="www.invision.com"
            required
            {...register("website")}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Est. Since</label>
          <input
            type="text"
            name="established"
            placeholder="06.04.2020"

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
          <label>Industry</label>

          {/* <Select
                        defaultValue={[catOptions[2]]}
                        isMulti
                        name="colors"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    /> */}
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
          <label>Allow In Search & Listing</label>
          <select
            className="chosen-single form-select"
            // {...register("insearch")}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>About Company</label>
          <textarea
            placeholder="Spent several years working on sheep on Wall Street. Had moderate success investing in Yugo's on Wall Street. Managed a small team buying and selling Pogo sticks for farmers. Spent several years licensing licorice in West Palm Beach, FL. Developed several new methods for working it banjos in the aftermarket. Spent a weekend importing banjos in West Palm Beach, FL.In this position, the Software Engineer collaborates with Evention's Development team to continuously enhance our current software solutions as well as create new solutions to eliminate the back-office operations and management challenges present"
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
