import Link from "next/link";
import { useState } from "react";
import { Tabs, Tab, Container, Row, Col, Nav } from "react-bootstrap";

const Pricing = () => {
  const student = localStorage.getItem("student");
  const access = localStorage.getItem("access");
  const [key, setKey] = useState(
    student === "false" ? "employers" : "students"
  );
  console.log(student);
  const pricingContentUser = [
    {
      id: 1,
      packageType: "Free",
      price: "0",
      tag: "",
      features: [
        { name: "Basic", disabled: false },
        { name: "Priority application for job", disabled: true },
        { name: "Direct Messaging to Hiring Manager", disabled: true },
        { name: "Basic Assessments", disabled: false },
        { name: "Advanced Assessment", disabled: true },
        { name: "Career Mapping", disabled: true },
      ],
    },
    {
      id: 2,
      packageType: "Pro",
      price: "9.99",
      tag: "tagged",
      features: [
        { name: "Basic", disabled: false },
        { name: "Priority application for job", disabled: false },
        { name: "Direct Messaging to Hiring Manager", disabled: false },
        { name: "Basic Assessments", disabled: false },
        { name: "Advanced Assessment", disabled: false },
        { name: "Career Mapping", disabled: false },
      ],
    },
  ];

  const pricingContentEmployer = [
    {
      id: 1,
      packageType: "Free",
      price: "0",
      tag: "",
      features: [
        { name: "Unlimited jobs and tests", disabled: true },
        { name: "Unlimited users", disabled: true },
        { name: "Custom questions per assessment", disabled: true },
        { name: "AI tools", disabled: true },
        { name: "candidate tracking", disabled: true },
        { name: "Direct Massaging", disabled: true },
        { name: "Unlimited Profile Views", disabled: true },
        { name: "Unlimited Resume Downloads", disabled: true },
        { name: "Manual scoring", disabled: true },
        { name: "Internal notes/comments", disabled: true },
        {
          name: "Comprehensive overview of all candidates, current and past",
          disabled: true,
        },
        { name: "Employer Branding", disabled: true },
        { name: "Cheating prevention tools", disabled: true },
      ],
    },
    {
      id: 2,
      packageType: "Pro",
      price: "49.99",
      tag: "tagged",
      features: [
        { name: "Unlimited jobs and tests", disabled: false },
        { name: "Unlimited users", disabled: false },
        { name: "Custom questions per assessment", disabled: false },
        { name: "AI tools", disabled: false },
        { name: "candidate tracking", disabled: false },
        { name: "Direct Massaging", disabled: false },
        { name: "Unlimited Profile Views", disabled: false },
        { name: "Unlimited Resume Downloads", disabled: false },
        { name: "Manual scoring", disabled: false },
        { name: "Internal notes/comments", disabled: false },
        {
          name: "Comprehensive overview of all candidates, current and past",
          disabled: false,
        },
        { name: "Employer Branding", disabled: false },
        { name: "Cheating prevention tools", disabled: false },
      ],
    },
  ];

  return (
    // <>
    //   {(student === "true" || student == null) && (
    //     <>
    //       <div className="sec-title text-center">
    //         <h2>Pricing Packages for Sudents</h2>
    //         <div className="text">Our payment plans.</div>
    //       </div>
    //       <div className="pricing-tabs tabs-box wow fadeInUp pt-5 mx-5 px-5">
    //         {/* <!--Tabs Container--> */}
    //         <div className="row">
    //           {pricingCotentUser.map((item) => (
    //             <div
    //               className={`pricing-table col-md-6 col-sm-12 ${item.tag}`}
    //               key={item.id}
    //             >
    //               <div className="inner-box">
    //                 {item.tag && <span className="tag">Recommended</span>}
    //                 <div className="title">{item.packageType}</div>
    //                 <div className="price">
    //                   ${item.price} <span className="duration">/ monthly</span>
    //                 </div>
    //                 <div className="table-content">
    //                   <ul>
    //                     {item.features.map((feature, i) => (
    //                       <li key={i}>
    //                         <span>
    //                           {feature.disabled ? (
    //                             <span className="cross-icon">❌</span>
    //                           ) : (
    //                             <span className="check-icon">✔️</span>
    //                           )}
    //                           {feature.name}
    //                         </span>
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </div>
    //                 <div className="table-footer">
    //                   <Link
    //                     href={access ? "/payment" : "login"}
    //                     className="theme-btn btn-style-three"
    //                   >
    //                     {item.tag ? "Upgrade" : "Get Started"}
    //                   </Link>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </>
    //   )}

    //   {(student === "false" || student == null) && (
    //     <>
    //       <div className="sec-title text-center">
    //         <h2>Pricing Packages for Employers</h2>
    //         <div className="text">Our payment plans.</div>
    //       </div>
    //       <div className="pricing-tabs tabs-box wow fadeInUp pt-5 mx-5 px-5">
    //         {/* <!--Tabs Container--> */}
    //         <div className="row">
    //           {pricingCotentEmployer.map((item) => (
    //             <div
    //               className={`pricing-table col-md-6 col-sm-12 ${item.tag}`}
    //               key={item.id}
    //             >
    //               <div className="inner-box">
    //                 {item.tag && <span className="tag">Recommended</span>}

    //                 <div className="title">{item.packageType}</div>
    //                 <div className="price">
    //                   ${item.price} <span className="duration">/ monthly</span>
    //                 </div>
    //                 <div className="table-content">
    //                   <ul>
    //                     {item.features.map((feature, i) => (
    //                       <li key={i}>
    //                         <span>
    //                           {feature.disabled ? (
    //                             <span className="cross-icon">❌</span>
    //                           ) : (
    //                             <span className="check-icon">✔️</span>
    //                           )}
    //                           {feature.name}
    //                         </span>
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </div>
    //                 <div className="table-footer">
    //                   <Link
    //                     href="/payment"
    //                     className="theme-btn btn-style-three"
    //                   >
    //                     {item.tag ? "Upgrade" : "Get Started"}
    //                   </Link>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </>
    //   )}
    // </>
    <Container className="mx-5 px-5">
      <div className="tabs-container">
        <Tabs
          id="pricing-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-5"
          variant="pills" // Use pill variant
        >
          <Tab eventKey="students" title="Pricing for Users">
            <div className="sec-title text-center">
              <h2>Pricing Packages for Users</h2>
              <div className="text">Our payment plans.</div>
            </div>
            <div className="pricing-tabs tabs-box wow fadeInUp">
              <Row>
                {pricingContentUser.map((item) => (
                  <Col
                    md={6}
                    sm={12}
                    className={`pricing-table ${item.tag}`}
                    key={item.id}
                  >
                    <div className="inner-box">
                      {item.tag && <span className="tag">Recommended</span>}
                      <div className="title">{item.packageType}</div>
                      <div className="price">
                        ${item.price}{" "}
                        <span className="duration">/ monthly</span>
                      </div>
                      <div className="table-content">
                        <ul>
                          {item.features.map((feature, i) => (
                            <li key={i}>
                              <span>
                                {feature.disabled ? (
                                  <span className="cross-icon">❌</span>
                                ) : (
                                  <span className="check-icon">✔️</span>
                                )}
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="table-footer">
                        <Link
                          href={access ? "/payment" : "login"}
                          className="theme-btn btn-style-three"
                        >
                          {item.tag ? "Upgrade" : "Get Started"}
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>
          <Tab eventKey="employers" title="Pricing for Employers">
            <div className="sec-title text-center">
              <h2>Pricing Packages for Employers</h2>
              <div className="text">Our payment plans.</div>
            </div>
            <div className="pricing-tabs tabs-box wow fadeInUp">
              <Row>
                {pricingContentEmployer.map((item) => (
                  <Col
                    md={6}
                    sm={12}
                    className={`pricing-table ${item.tag}`}
                    key={item.id}
                  >
                    <div className="inner-box">
                      {item.tag && <span className="tag">Recommended</span>}
                      <div className="title">{item.packageType}</div>
                      <div className="price">
                        ${item.price}{" "}
                        <span className="duration">/ monthly</span>
                      </div>
                      <div className="table-content">
                        <ul>
                          {item.features.map((feature, i) => (
                            <li key={i}>
                              <span>
                                {feature.disabled ? (
                                  <span className="cross-icon">❌</span>
                                ) : (
                                  <span className="check-icon">✔️</span>
                                )}
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="table-footer">
                        <Link
                          href="/payment"
                          className="theme-btn btn-style-three"
                        >
                          {item.tag ? "Upgrade" : "Get Started"}
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default Pricing;
