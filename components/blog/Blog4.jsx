import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Blog4 = () => {
  return (
    <>
      {blogContent.slice(7, 10).map((item) => (
        <div className="col-sm-12 col-md-6 col-lg-3 mb-4" key={item.id}>
          <div
            className="blog -type-1 align-items-center justify-content-center border shadow-lg"
            style={{ backgroundColor: `${item?.backgroundColor}` }}
          >
            <div className="blog-data">{item?.data}</div>
            <div className="blog-content">
              <div>{item?.blogText}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Blog4;
