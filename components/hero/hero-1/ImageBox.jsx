import Social from "@/components/candidates-single-pages/social/Social";
import SocialHero from "@/components/candidates-single-pages/social/Social-hero";
import Image from "next/image";

const ImageBox = () => {
  return (
    <div className="image-box">
      <figure
        className="main-image"
        // data-aos="fade-in"
        // data-aos-delay="500"
      >
        <Image
          width={500}
          height={600}
          src="/images/resource/new_hero.jpg"
          alt="hero image"
          className="img-1"
        />
        {/* <div className="social-hero">
          <SocialHero />
        </div> */}
        <Image
          width={150}
          height={100}
          // layout="responsive"
          src="/images/resource/shape.png"
          alt="dots"
          className="shape"
        />

        {/* <Image
          width={300}
          height={200}
          // layout="responsive"
          src="/images/resource/polka_dot.webp"
          alt="hero image"
          className="polka-1"
        /> */}
      </figure>
      <Image
        width={50}
        height={50}
        // layout="responsive"
        src="/images/resource/star-3.png"
        alt="dots"
        className="star-3"
      />

      {/* <div className="info_block" data-aos="fade-in" data-aos-delay="1000">
        <span className="icon flaticon-email-3"></span>
        <p>
          Work Inquiry From <br />
          Ali Tufan
        </p>
      </div> */}

      {/* <div className="info_block_two" data-aos="fade-in" data-aos-delay="2000">
        <p>10k+ Candidates</p>
        <div className="image">
          <Image
            width={206}
            height={53}
            src="/images/resource/new_hero.jpg"
            alt="mulit people"
          />
        </div>
      </div> */}

      {/* <div
        className="info_block_three"
        data-aos="fade-in"
        data-aos-delay="1500"
      >
        <span className="icon flaticon-briefcase"></span>
        <p>Creative Agency</p>
        <span className="sub-text">Startup</span>
        <span className="right_icon fa fa-check"></span>
      </div> */}

      {/* <div className="info_block_four" data-aos="fade-in" data-aos-delay="2500">
        <span className="icon flaticon-file"></span>
        <div className="inner">
          <p>Upload Your CV</p>
          <span className="sub-text">It only takes a few seconds</span>
        </div>
      </div> */}
    </div>
  );
};

export default ImageBox;
