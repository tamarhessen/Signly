import './TopPanel.css';

function TopPanel({ userImg, navigate }) {
  return (
    <header className="header">
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="Signly Logo"
          onClick={() => navigate("/")}
          className="logo-image" 
        />
      </div>
      <input 
        type="text" 
        placeholder="Search for a sign..." 
        className="search-bar" 
      />
      <div className="profile-picture" onClick={() => navigate("/profile")}>
        <img 
          src={userImg || '/profile.jpg'} 
          alt="Profile" 
          className="profile-image" 
        />
      </div>
    </header>
  );
}

export default TopPanel;
