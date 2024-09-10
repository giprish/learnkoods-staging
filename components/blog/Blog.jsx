import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Blog = () => {
  return (
    <div className="container pt-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="heading">Check our Latest News and Updates</h2>
        <Link
          href="/blog"
          className="theme-btn btn-style-blue py-3"
          style={{ fontSize: "18px" }}
        >
          View All Articles
        </Link>
      </div>
      <div className="row">
        {blogContent.slice(0, 3)?.map((item) => (
          <div className="news-block col-lg-4 col-md-6 col-sm-12" key={item.id}>
            <div className="inner-box">
              <div className="image-box">
                <figure className="image">
                  <Image
                    width={391}
                    height={258}
                    layout="responsive"
                    src={item.img}
                    alt="blog post"
                  />
                </figure>
              </div>
              <div className="lower-content">
                <ul className="post-meta">
                  <li>
                    <a href="#">August 31, 2021</a>
                  </li>
                  <li>
                    <a href="#">12 Comment</a>
                  </li>
                </ul>
                <h3>
                  <Link href={`/blog-details/${item.id}`}>{item.title}</Link>
                </h3>
                <p className="text">{item.blogText}</p>
                <Link href={`/blog-details/${item.id}`} className="read-more">
                  Read More <i className="fa fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
