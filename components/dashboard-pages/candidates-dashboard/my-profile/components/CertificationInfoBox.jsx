"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Select from "react-select";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCertificateSchema } from "@/validation/validation";

const CertificationInfoBox = () => {
  const [userId, setUserId] = useState("");
  const [access, setAccess] = useState(null);
  const [orgState, setOrgState] = useState([]);
  const [certTitles, setCertTitles] = useState({});

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
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(userCertificateSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificate",
  });

  const certificates = watch("certificate");

  const addEntry = () => {
    append({});
  };

  const fetchSkill = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/skill_api/`);
    return response.data;
  };

  const { data: skills } = useQuery({
    queryKey: ["skillData"],
    queryFn: () => fetchSkill(),
  });
  const fetchOrg = async () => {
    const response = await axios.get(`${process.env.GLOBAL_API}/cert-org/`);
    return response.data;
  };

  const { data: orgs } = useQuery({
    queryKey: ["orgData"],
    queryFn: () => fetchOrg(),
  });

  const fetchCert = async (orgId) => {
    if (!orgId) return []; // Return empty array if no orgId provided

    try {
      const response = await axios.get(
        `${process.env.GLOBAL_API}/cert-org-title/${orgId}/`
      );
      return response.data;
    } catch (error) {
      // Log or handle the error as needed
      console.error(
        `Failed to fetch certificate titles for orgId ${orgId}:`,
        error
      );
      return []; // Return empty array or handle the error based on your requirements
    }
  };

  // State to store cert_title options

  // Fetch cert_titles dynamically based on issuing_organization IDs
  // Helper function to handle fetching cert titles
  const fetchAndSetCertTitles = useCallback(async (orgId, index) => {
    if (orgId) {
      try {
        const titles = await fetchCert(orgId);
        setCertTitles((prev) => ({
          ...prev,
          [index]:
            titles?.data?.map((title) => ({
              value: title.id,
              label: title.name,
            })) || [],
        }));
      } catch (error) {
        setCertTitles((prev) => ({
          ...prev,
          [index]: [],
        }));
      }
    }
  }, []);
  // Effect to handle fetching cert titles when issuing organizations change
  useEffect(() => {
    orgState.forEach((item, index) => {
      const orgId = item?.issuing_organization?.value;
      fetchAndSetCertTitles(orgId, index);
    });
  }, [orgState, fetchAndSetCertTitles]);
  // Handle issuing organization change
  const handleOrgChange = (selectedOption, index) => {
    setValue(`certificate[${index}].issuing_organization`, selectedOption);
    setOrgState((prev) => {
      const newOrgState = [...prev];
      newOrgState[index] = { issuing_organization: selectedOption };
      return newOrgState;
    });
    setValue(`certificate[${index}].cert_title`, ""); // Reset cert_title when org changes
  };

  const options = (optiondata) => {
    if (optiondata?.message) {
      return optiondata?.message?.map((option) => ({
        value: option.id,
        label: option.data || option.name,
      }));
    }
    return optiondata?.data?.map((option) => ({
      value: option.id,
      label: option.data || option.name,
    }));
  };

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
    enabled: !!access,
    retry: 0,
  });

  const certdata = userCertificate?.data?.map((item) => {
    // Build the certificate object with all fields
    const certificate = {
      id: item.id,
      issuing_organization: {
        value: item?.issuing_organization.id,
        label: item?.issuing_organization.name,
      },
      cert_title: {
        value: item?.cert_title.id,
        label: item?.cert_title.name,
      },
      issue_date: item.issue_date,
      description: item.description,
      link: item.link,
      certificate_file: item.certificate_file,
      skills_acquired: item.skills_acquired?.map((skill) => ({
        value: skill.id,
        label: skill.data,
      })),
      is_current: item.is_current,
      // Conditionally include `expiration_date` if it is not null
      ...(item.expiration_date !== null
        ? { expiration_date: item.expiration_date }
        : {}),
    };

    return certificate;
  });

  useEffect(() => {
    console.log(certdata, "certdata");
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
          } else if (key === "cert_title" || key === "issuing_organization") {
            formData.append(key, certificate[key].value);
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

        // Loop over the keys in dirtyFields for the current certificate
        Object.keys(dirtyFields.certificate[index]).forEach((key) => {
          if (dirtyFields.certificate[index][key] === true) {
            // Field is dirty, process the update for this field
            if (
              key === "certificate_file" &&
              certificate.certificate_file?.length > 0
            ) {
              dirtyformData.append(key, certificate.certificate_file[0]);
            }
            if (key === "skills_acquired" && Array.isArray(certificate[key])) {
              certificate[key].forEach((element, index) => {
                dirtyformData.append(`${key}[${index}]`, element.label);
              });
            } else if (key === "cert_title" || key === "issuing_organization") {
              dirtyformData.append(key, certificate[key].value);
            } else {
              dirtyformData.append(key, certificate[key]);
            }
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
    const formData = getValues();
    console.log(formData, "education data");
    console.log(dirtyFields, "dirty fields");
    mutate({ data: formData, dirtyFields });
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
      {fields?.map((item, index) => {
        const certificateUrl = item.certificate_file;
        const certTitleOptions = certTitles[index] || [];
        const isCurrent = certificates[index]?.is_current;
        return (
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
              <label>Issuing Organization</label>

              <Controller
                name={`certificate[${index}].issuing_organization`}
                control={control}
                rules={{ required: "Please select at organization" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={options(orgs)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selected) => {
                      field.onChange(selected); // Ensure the value is updated in the form state
                      handleOrgChange(selected, index); // If additional logic is needed
                    }}
                  />
                )}
              />
              {errors.certificate?.[index]?.issuing_organization && (
                <p className="text-danger">
                  {errors.certificate[index].issuing_organization.message}
                </p>
              )}
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Title of Certificate</label>

              <Controller
                name={`certificate[${index}].cert_title`}
                control={control}
                rules={{ required: "Please select at certificate" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={certTitleOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.certificate?.[index]?.cert_title && (
                <p className="text-danger">
                  {errors.certificate[index].cert_title.message}
                </p>
              )}
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Certificate</label>
              <div className="d-flex align-items-center">
                <input
                  className="form-control py-3 px-4"
                  type="file"
                  accept=".pdf, .docx"
                  name={`certificate[${index}].certificate_file`}
                  {...register(`certificate[${index}].certificate_file`)}
                  // required={!certificateUrl}
                />
                {certificateUrl && (
                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary mx-2 "
                  >
                    Preview
                  </a>
                )}
              </div>
              {errors.certificate?.[index]?.certificate_file && (
                <p className="text-danger mt-2">
                  {errors.certificate[index].certificate_file.message}
                </p>
              )}
            </div>

            <div className="form-group col-lg-12 col-md-12">
              <label>Description</label>
              <input
                type="text"
                name={`certificate[${index}].description`}
                placeholder="Description"
                {...register(`certificate[${index}].description`)}
                required
              />
              {errors.certificate?.[index]?.description && (
                <p className="text-danger">
                  {errors.certificate[index].description.message}
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

            {!isCurrent && (
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
            <div className=" col-lg-12 col-md-12 py-3">
              <Controller
                name={`certificate[${index}].is_current`}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    {...field}
                    className="mx-4"
                    checked={field.value || false} // Ensure the checkbox reflects boolean value
                    onChange={(e) => {
                      field.onChange(e.target.checked); // Update with the boolean value
                    }}
                  />
                )}
              />

              <label>No Expiry Date</label>
              {errors.certificate?.[index]?.is_current && (
                <p className="text-danger">
                  {errors.certificate[index].is_current.message}
                </p>
              )}
            </div>
            <div className="form-group col-lg-6 col-md-12 my-4">
              <label>Link This Certificate</label>
              <input
                type="url"
                name={`certificate[${index}].link`}
                placeholder="Link This Certificate"
                {...register(`certificate[${index}].link`)}
              />
              {errors.certificate?.[index]?.link && (
                <p className="text-danger">
                  {errors.certificate[index].link.message}
                </p>
              )}
            </div>
            <div className="form-group col-lg-6 col-md-12 my-4">
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
                    options={options(skills)}
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
        );
      })}

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
