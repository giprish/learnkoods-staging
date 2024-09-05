import Link from "next/link";

const Pricing = () => {
  const pricingCotent = [
    {
      id: 1,
      packageType: "Free",
      price: "0",
      tag: "",
      features: ["Basic ", "Basic Assessments"],
    },
    {
      id: 2,
      packageType: "Pro",
      price: "9.99 or 10",
      tag: "tagged",
      features: [
        "Basic",
        "Priority application for job",
        "Direct Messaging to Hiring Manager",
        "Basic Assessments",
        "Advanced Assessment",
        "Career Mapping",
      ],
    },
  ];

  return (
    <div className="pricing-tabs tabs-box wow fadeInUp">
      {/* <!--Tabs Container--> */}
      <div className="row">
        {pricingCotent.map((item) => (
          <div
            className={`pricing-table col-lg-4 col-md-6 col-sm-12 ${item.tag}`}
            key={item.id}
          >
            <div className="inner-box">
              {item.tag ? (
                <>
                  <span className="tag">Recommended</span>
                </>
              ) : (
                ""
              )}

              <div className="title">{item.packageType}</div>
              <div className="price">
                ${item.price} <span className="duration">/ monthly</span>
              </div>
              <div className="table-content">
                <ul>
                  {item.features.map((feature, i) => (
                    <li key={i}>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="table-footer">
                <Link href="/payment" className="theme-btn btn-style-three">
                  {item.tag ? "Upgrade" : "Get Started"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
