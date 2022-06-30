import './appHeader.scss'
import logo from '../../imgs/Logo.svg'

const AppHeader = () => {
    return (
        <div className="header">
            <div className="header-container">
                <a href="#"><img src={logo} alt="logo" /></a>
                <div className="btns-inner">
                    <button className='btn header-btn-users'>Users</button>
                    <button className='btn'>Sign Up</button>
                </div>
            </div>
            <div className="header-inner">
                <div className="header-inner-text">
                    <div>
                        <h1 className='header-text'>Test assignment for front-end developer</h1>
                        <p className='header-subtext'>What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.</p>
                        <button className='btn btn-center'>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppHeader;