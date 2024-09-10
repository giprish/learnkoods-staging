"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { element } from "prop-types";
import { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const StepThree = ({ setTab, onSubmit, onError }) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "questions", // unique name for your Field Array
    }
  );

  const [count, setCount] = useState(0);

  const handlePreviewClick = () => {
    const formData = getValues();
    window.localStorage.setItem("job_preview", JSON.stringify(formData));
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit, onError)}>
      {/* <div className="row border p-2 rounded-4 mb-4 mx-1">
        <h4 className="border-bottom p-2 mb-3">Receive qualified applicants</h4>
        <span className="p-2">Applicant collection</span>
        <div className="form-group col-lg-4 col-md-6">
          <label>Recieve Applicants</label>
          <select className="chosen-single form-select">
            <option value="">Select</option>
            <option value="By email">By email</option>
          </select>
        </div>
        <div className="form-group col-lg-8 col-md-6">
          <label>By Email</label>
          <input type="email" name="email" placeholder="john@mail.com" />
        </div>
      </div> */}
      <div>
        <div>
          <h5>Screening Question</h5>
          <span>
            we recommend adding 3 or more questions.Applicants must answer each
            question.
          </span>
          {[...Array(count)]?.map((element, index) => {
            return (
              <div className="border rounded-4 my-3 ">
                <div className="d-flex justify-content-between ">
                  <label className="p-2 mx-4">Question {index + 1}:-</label>
                  <button
                    onClick={() => setCount((prev) => prev - 1)}
                    className="mx-3"
                  >
                    <i className="la la-times font-weight-bold"></i>
                  </button>
                </div>
                <div className="d-flex col-10 ">
                  <input
                    // key={element.id}
                    type="text"
                    className="border w-75 m-2 rounded-2 p-2"
                    {...register(`questions.${index}.question_name`)}
                  />

                  <div className="m-3">
                    <input
                      type="checkbox"
                      {...register(`questions.${index}.must_have`)}
                    />
                    <label className="mx-1">Mandatory</label>
                  </div>
                </div>
                {errors?.questions?.[index]?.question_name && (
                  <p className="text-danger mx-4">
                    {errors.questions[index].question_name.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 ">
          <h6>Add Screening Questions</h6>
          <div className="d-flex flex-wrap">
            <button
              type="button"
              className={`theme-btn small border rounded-3 p-2 px-2 my-2 bg-success text-white  ${""}`}
              onClick={() => setCount((prev) => prev + 1)}
            >
              Add Question
            </button>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-6 text-right d-flex justify-content-between py-4">
          <button
            className="theme-btn btn-style-one"
            type="button"
            onClick={() => setTab("step2")}
          >
            Previous
          </button>

          <button className="theme-btn btn-style-one" type="submit">
            Publish
          </button>
        </div>
      </div>
    </form>
  );
};

export default StepThree;
