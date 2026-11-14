import "./App.css";

function App(){
  const name="Rohim hasan"
  const skills=["html","css","javascript","react"];
  const year=new Date().getFullYear();

  return (
    <div className="app">
      <div className="className">
        <img src="https://open.spotify.com/track/1XysGld20J2MODqaaqJvl7"alt="Profile" className="avater"/>
        <h1>Hello, {name}!</h1>
        <P className= "role">Web developer</P>

        <h3>My skills</h3>
        <ul>
          {skills.map((skills,i) =>  (
            <li key={i}>{skill}</li>
          ))}
        </ul>
        <button onClick={() => alart("Hello React")}>Click Me</button>

        <p className="footer">@ {year}</p>
      </div>
    </div>
  );
}

export default App;