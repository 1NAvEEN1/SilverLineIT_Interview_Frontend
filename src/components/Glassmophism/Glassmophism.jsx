import './Glass.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Glassmophism() {


    
        useEffect(() => {
          AOS.init({ duration: 1200 });
        }, []);


  return (
    <div className='container'>
      
      <div className='card'  data-aos="zoom-in">
        <div className='contentbef'>
          <h3>Card One </h3>
        </div>
        <div className='content' >
          <h3>Card One</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          <a href='/'>Read More</a>
        </div>
      </div>
      <div className='card'  data-aos="zoom-in">
        <div className='content'>
          
          <h3>Card Two</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          <a href='/'>Read More</a>
        </div>
      </div>
      <div className='card'  data-aos="zoom-in">
        <div className='content'>
          
          <h3>Card Three</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          <a href='/'>Read More</a>
        </div>
      
      </div>
    </div>
  );
}
