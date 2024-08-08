import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Blog4 = () => {
  return (
    <>
      <div className="my-4">
        <h3 className="text-center mb-4 heading">
          The working world requires a new set of skills.
        </h3>
      </div>
      {blogContent.slice(7, 10).map((item) => (
        <div className="col-sm-12 col-md-6 col-lg-3 mb-4" key={item.id}>
          <div
            className="blog -type-1 align-items-center justify-content-center border"
            style={{
              backgroundColor: `${item?.backgroundColor}`,
              color: `${item?.color}`,
            }}
          >
            <div className="blog-data">{item?.data}</div>
            <div className="blog-content">
              <div style={{ color: `${item?.color}` }}>{item?.blogText}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Blog4;
