"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import Map from "../../../Map";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCertificateSchema } from "@/validation/validation";

const CertificationInfoBox = () => {
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setAccess(localStorage.getItem("access"));
    }
  }, []);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields, errors },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(userCertificateSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificate",
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
  const fetchSkill = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/skill_api/`);
    return response.data;
  };

  const { data: skills } = useQuery({
    queryKey: ["skillData"],
    queryFn: () => fetchSkill(),
  });

  const skillOption = skills?.data?.map((option) => ({
    value: option.id,
    label: option.data,
  }));

  const fetchCertificates = async () => {
    const response = await axios.get(
      `${process.env.GLOBAL_API}/cert-pro/${userId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  const { data: userCertificate } = useQuery({
    queryKey: ["userCertificate", access],
    queryFn: () => fetchCertificates(),
  });

  const certdata = userCertificate?.data.map((item) => ({
    ...item,
    skills_acquired: item.skills_acquired.map((skill) => ({
      value: skill.id,
      label: skill.data,
    })),
  }));
  useEffect(() => {
    if (userCertificate) {
      reset({ certificate: certdata });
    }
  }, [userCertificate]);

  const createOrUpdateCertificate = async ({ data }) => {
    const createPromises = [];
    const updatePromises = [];

    data.certificate.forEach((certificate, index) => {
      const formData = new FormData();
      const dirtyformData = new FormData();
      const isNewCertificate = !certificate.id;

      if (isNewCertificate) {
        // Create new certificate: include all fields
        Object.keys(certificate).forEach((key) => {
          if (
            key === "certificate_file" &&
            certificate.certificate_file?.length > 0
          ) {
            formData.append(key, certificate.certificate_file[0]);
          }
          if (key === "skills_acquired" && Array.isArray(certificate[key])) {
            certificate[key].forEach((element, index) => {
              formData.append(`${key}[${index}]data`, element.label);
            });
          } else {
            formData.append(key, certificate[key]);
          }
        });
        formData.append("user_profile", userId);
        createPromises.push(
          axios.post(`${process.env.GLOBAL_API}/certificate/`, formData, {
            headers: {
              Authorization: `Bearer ${access}`,
              "Content-Type": "multipart/form-data",
            },
          })
        );
      } else if (dirtyFields.certificate && dirtyFields.certificate[index]) {
        // Update existing certificate: include only dirty fields
        Object.keys(dirtyFields.certificate[index]).forEach((key) => {
          if (
            key === "certificate_file" &&
            certificate.certificate_file?.length > 0
          ) {
            dirtyformData.append(key, certificate.certificate_file[0]);
          }
          if (key === "skills_acquired" && Array.isArray(certificate[key])) {
            certificate[key].forEach((element, index) => {
              dirtyformData.append(`${key}[${index}]data`, element.label);
            });
          } else {
            dirtyformData.append(key, certificate[key]);
          }
        });
        updatePromises.push(
          axios.put(
            `${process.env.GLOBAL_API}/certificate/${certificate.id}/`,
            dirtyformData,
            {
              headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        );
      }
    });

    // Wait for all promises to complete
    await Promise.all([...createPromises, ...updatePromises]);
  };

  const { mutate } = useMutation({
    mutationFn: createOrUpdateCertificate,
    onSuccess: (data) => {
      console.log(data, "data from sucessful certificate update");
      toast.success("certificate updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "error message");
      toast.error("certificate update Unsuccessful", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const onSubmit = (data) => {
    console.log(data, "certificate data");
    mutate({ data });
  };

  const deleteFieldAPI = async (fieldId) => {
    const response = await axios.delete(
      `${process.env.GLOBAL_API}/certificate/${fieldId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    return response;
  };
  const deleteMutation = useMutation({
    mutationFn: deleteFieldAPI,
    onSuccess: (data) => {
      console.log(data, "data from sucessful certificate delete");
      toast.success("certificate deleted successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
    onError: (error) => {
      console.log(error, "data from sucessful certificate delete");
      toast.error("certificate deletion successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleDelete = async (index) => {
    // Ensure certdata exists and index is within bounds
    if (Array.isArray(certdata) && index >= 0 && index < certdata.length) {
      const fieldId = certdata[index]?.id;

      if (fieldId) {
        deleteMutation.mutate(fieldId, {
          onSuccess: () => {
            remove(index);
          },
        });
      } else {
        remove(index);
      }
    } else {
      remove(index);
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((item, index) => (
        <div className="row border rounded-3 p-2 mb-4 " key={item.id}>
          <div className="form-group col-lg-12 col-md-12 d-flex flex-row-reverse">
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="border p-2 rounded-4 theme-btn btn-style-one"
            >
              <i className="la la-trash font-weight-bold"></i>
            </button>
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <label>Title of Certificate</label>
            <input
              type="text"
              name={`certificate[${index}].cert_title`}
              placeholder="Title of Certificate"
              {...register(`certificate[${index}].cert_title`)}
              required
            />
            {errors.certificate?.[index]?.cert_title && (
              <p className="text-danger">
                {errors.certificate[index].cert_title.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Issuing Organization</label>
            <input
              type="text"
              name={`certificate[${index}].issuing_organization`}
              placeholder="Issuing Organization"
              {...register(`certificate[${index}].issuing_organization`)}
              required
            />
            {errors.certificate?.[index]?.issuing_organization && (
              <p className="text-danger">
                {errors.certificate[index].issuing_organization.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Certificate</label>
            <input
              className="form-control py-3 "
              type="file"
              accept=".pdf, .docx"
              name={`certificate[${index}].certificate_file`}
              {...register(`certificate[${index}].certificate_file`)}
              required
            />
            {errors.certificate?.[index]?.certificate_file && (
              <p className="text-danger">
                {errors.certificate[index].certificate_file.message}
              </p>
            )}
          </div>

          <div className="form-group-date col-lg-6 col-md-12 ">
            <label className="">Issuing Date</label>
            <input
              type="date"
              name={`certificate[${index}].issue_date`}
              placeholder="Issuing Date"
              {...register(`certificate[${index}].issue_date`)}
              className="border p-3 rounded-3"
              required
            />
            {errors.certificate?.[index]?.issue_date && (
              <p className="text-danger">
                {errors.certificate[index].issue_date.message}
              </p>
            )}
          </div>

          {workingState[index] && (
            <>
              <div className="form-group-date col-lg-6 col-md-12">
                <label>Expiration Date</label>
                <input
                  type="date"
                  name={`certificate[${index}].expiration_date`}
                  placeholder="Expiration Date"
                  {...register(`certificate[${index}].expiration_date`)}
                  className="border p-3 rounded-3"
                />
                {errors.certificate?.[index]?.expiration_date && (
                  <p className="text-danger">
                    {errors.certificate[index].expiration_date.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="form-group col-lg-12 col-md-12 p-4">
            <input
              type="checkbox"
              placeholder=""
              {...register(`certificate[${index}].working`)}
              className="mx-4"
              onChange={() => handleWorkingChange(index)}
            />
            <label>Has Expiry Date</label>
            {errors.certificate?.[index]?.working && (
              <p className="text-danger">
                {errors.certificate[index].working.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Link This Certificate</label>
            <input
              type="url"
              name={`certificate[${index}].link`}
              placeholder="Link This Certificate"
              {...register(`certificate[${index}].link`)}
              required
            />
            {errors.certificate?.[index]?.link && (
              <p className="text-danger">
                {errors.certificate[index].link.message}
              </p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Gained Skills</label>
            <Controller
              name={`certificate[${index}].skills_acquired`}
              control={control}
              // defaultValue={[]}
              rules={{ required: "Please select at least one skill" }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={skillOption}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.certificate?.[index]?.skills_acquired && (
              <p className="text-danger">
                {errors.certificate[index].skills_acquired.message}
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="form-group d-flex col-lg-12 col-md-12 justify-content-between">
        <button
          type="button"
          onClick={addEntry}
          className="theme-btn btn-style-one"
        >
          {/* <i className="la la-plus "></i> */}
          <span className="mx-2">Add Certification</span>
        </button>
        {/* <button
          type="button"
          onClick={() => handleDelete(index, item.id)}
          className=" "
        >
          <i className="la la-trash "></i>
          <span className="mx-2">Delete Entry</span>
        </button> */}
      </div>
      <div className="m-0 pb-4 form-group col-lg-12 col-md-12">
        <button type="submit" className="theme-btn btn-style-one">
          Save
        </button>
      </div>
    </form>
  );
};

export default CertificationInfoBox;
