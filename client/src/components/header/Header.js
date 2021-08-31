import React from 'react';
import {Link} from 'react-router-dom'
function Header() {
  return (
    <header>
        <div class="logo">
            <h1><Link to= "/">Stagiaire</Link></h1>
        </div>

        <ul>
            <li><Link to="/"><i class="fas fa-home"></i>Home</Link></li>
            <li><Link to="/login"><i class="fas fa-user"></i>Sign in</Link></li>
        </ul>


    </header>
  );
}

export default Header;