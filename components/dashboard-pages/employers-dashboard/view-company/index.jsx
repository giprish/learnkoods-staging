"use client";

import LoginPopup from "../../../common/form/login/LoginPopup";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import DefaulHeader from "@/components/header/DefaulHeader";
import { useRouter } from "next/router";

const index = () => {

    const router = useRouter();
    const { id } = router.query
    const access = window.localStorage.getItem("access");

    const fetchCompany = async () => {
        const response = await axios.get(`${process.env.GLOBAL_API}/comp/${id}/`, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });
        return response.data.data;
    };

    const { data: companies, isError } = useQuery({
        queryKey: ["companyList", access],
        queryFn: () => fetchCompany(),
        retry: 1,
    });

    if (isError) {
        router.push('/employers-dashboard/company-profile');
    }

    console.log(companies);

    return (
        <div className={`page-wrapper`}>
            <span className="header-span"></span>

            <LoginPopup />

            <DefaulHeader />

            <section className="job-detail-section">
                <div className="upper-box">
                    <div className="auto-container">
                        <div className="job-block-seven">
                            <div className="inner-box">
                                <div className="d-flex align-items-center">
                                    <div className="mx-4">
                                        <div
                                            style={{
                                                width: "175px",
                                                height: "175px",
                                                borderRadius: "50%",
                                                border: "5px solid #ddd",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={`${companies?.logo}` || "/images/logo.svg"}
                                                alt="logo"
                                                width={200}
                                                height={200}
                                                style={{

                                                    objectFit: "contain",
                                                    width: "70%",
                                                    height: "auto",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4>{companies?.name}</h4>
                                        {/* <a href="/" target="_blank">
                                            <h5 className="mb-3">{companies?.industry?.name}</h5>
                                        </a> */}

                                        <ul className="job-info">
                                            <li>
                                                <span className="icon flaticon-map-locator"></span>
                                                {companies?.city?.name}, {companies?.country?.name}
                                            </li>
                                            <li>
                                                <span className="icon flaticon-briefcase"></span>
                                                {companies?.industry?.name}
                                            </li>
                                            <li>
                                                <span className="icon flaticon-mail"></span>
                                                {companies?.email}
                                            </li>
                                        </ul>


                                        {/* <ul className="job-other-info">
                                            {job?.skills_req?.slice(0, 3)?.map((val, i) => (
                                                <li key={i} className={`skilltab`}>
                                                    {val?.data}
                                                </li>
                                            ))}
                                            {job?.skills_req?.length > 3 ? (
                                                // Render this if there are more than 3 items
                                                <li className="skilltab">
                                                    <a
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#skillModal"
                                                    >
                                                        Show more ...
                                                    </a>
                                                </li>
                                            ) : (
                                                // Render this if there are 3 or fewer items
                                                <></>
                                            )}
                                        </ul> */}


                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="job-detail-outer">
                    <div className="auto-container">
                        <div className="row">
                            <div className="content-column col-lg-8 col-md-12 col-sm-12">
                                <h4 className="mb-3" style={{ fontWeight: '500' }}>About Company</h4>
                                <div
                                    dangerouslySetInnerHTML={{ __html: companies?.description }}
                                ></div>
                            </div>

                            <div className="col-lg-4 col-md-12 col-sm-12">

                                <div className="sidebar-widget company-widget">
                                    <ul className="company-info mt-0">
                                        <li>
                                            Primary industry: <span>{companies?.industry?.name}</span>
                                        </li>
                                        <li>
                                            Company size: <span>{companies?.team_size}</span>
                                        </li>
                                        <li>
                                            Founded in: <span>{companies?.since}</span>
                                        </li>
                                        <li>
                                            Email: <span>{companies?.email}</span>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default index;
