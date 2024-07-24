import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Map from "../../../Map";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { useState } from "react";

const EducationInfoBox = ({ onSubmit }) => {
  const { register, handleSubmit, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const [workingState, setWorkingState] = useState({});

  const addEntry = () => {
    append({});
  };

  const handleWorkingChange = (index) => {
    setWorkingState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((item, index) => (
        <div className="row border rounded-3 p-2 mb-4 " key={item.id}>
          <div className="form-group col-lg-12 col-md-12 d-flex flex-row-reverse">
            <button
              type="button"
              onClick={() => remove(index)}
              className="border p-2 rounded-4 theme-btn btn-style-one"
            >
              <i className="la la-times font-weight-bold"></i>
            </button>
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>School or Institute Name</label>
            <input
              type="text"
              name={`experience[${index}].title`}
              placeholder="University of Pennsylvania"
              {...register(`experience[${index}].institute`)}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Course Name</label>
            <input
              type="text"
              name={`experience[${index}].employment_type`}
              placeholder="Btech"
              {...register(`experience[${index}].course`)}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Department</label>
            <input
              type="text"
              name={`experience[${index}].company_name`}
              placeholder="School of Engineering"
              {...register(`experience[${index}].department`)}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Location</label>
            <input
              type="text"
              name={`experience[${index}].location`}
              placeholder="Location"
              {...register(`experience[${index}].location`)}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Location Type</label>
            <input
              type="text"
              name={`experience[${index}].location_type`}
              placeholder="Location Type"
              {...register(`experience[${index}].location_type`)}
            />
          </div>
          <div className="form-group-date col-lg-6 col-md-12 ">
            <label className="">Start Date</label>
            <input
              type="date"
              name={`experience[${index}].start_date`}
              placeholder="Additional Field 1"
              {...register(`experience[${index}].start_date`)}
              className="border p-3 rounded-3"
            />
          </div>

          {!workingState[index] && (
            <>
              <div className="form-group-date col-lg-6 col-md-12">
                <label>End Date</label>
                <input
                  type="date"
                  name={`experience[${index}].end_date`}
                  placeholder="Additional Field 2"
                  {...register(`experience[${index}].end_date`)}
                  className="border p-3 rounded-3"
                />
              </div>
            </>
          )}
          <div className="form-group col-lg-12 col-md-12 p-4">
            <input
              type="checkbox"
              placeholder="creativelayers"
              {...register(`experience[${index}].working`)}
              className="mx-4"
              onChange={() => handleWorkingChange(index)}
            />
            <label>I am currently studying here</label>
          </div>
        </div>
      ))}
      <div className="form-group col-lg-12 col-md-12">
        <button
          type="button"
          onClick={addEntry}
          className="theme-btn btn-style-one"
        >
          Add Entry
        </button>
      </div>
      <div className="form-group col-lg-12 col-md-12">
        <button type="submit" className="theme-btn btn-style-one">
          Save
        </button>
      </div>
    </form>
  );
};

export default EducationInfoBox;
