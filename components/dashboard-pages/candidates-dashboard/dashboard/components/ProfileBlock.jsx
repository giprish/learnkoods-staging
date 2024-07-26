const ProfileBlock = ({ user }) => {
  console.log(user?.data?.skills);
  return (
    <>
      <div className="ui-block col-xl-6 col-lg-6 col-md-6 col-sm-12 border rounded-4 mb-4 ml-2 shadow">
        <div className="m-3 ">
          <h4 className="font-weight-bold">Skills</h4>
        </div>
        {user?.data?.skills.map((item, index) => {
          return (
            <div className="theme-btn btn-style-new mt-2 mx-2" key={index}>
              {item.data}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProfileBlock;
