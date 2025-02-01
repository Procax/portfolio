import logo from './logo.svg';
import './App.css';
import Nav from './Nav/Nav';
import Profile from './Profile/Profile';
import Section from './Card-Section/Section';
import Footer from './Footer/Footer';

function App() {
  return (
    <div className="App">
            <Nav/>
      <div className='flex'>
      <Profile/>
    </div>
    <Footer/>

    </div>
  );
}

export default App;
