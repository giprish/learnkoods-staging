import { Controller, useFormContext } from "react-hook-form";

const Form = ({ onSubmit, onError }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="widget-content">
      <form
        action="#"
        className="default-form px-4"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div className="row">
          {/* <!-- Input --> */}
          <div className="form-group col-lg-6 col-md-12">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter first name"
              required
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-danger">{errors.first_name.message}</p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              required
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-danger">{errors.last_name.message}</p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>User Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              {...register("username")}
            />
            {errors.username && (
              <p className="text-danger">{errors.username.message}</p>
            )}
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              required
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>
          <div className="form-group col-lg-12 col-md-12">
            <button type="submit" className="theme-btn btn-style-one">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
